import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "server", "db.json");

// Helper to load/save mock database safely
async function loadDb() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file, returning fallback structure", error);
    return { pets: [], appointments: [], feedbacks: [], petgram: [], chats: [] };
  }
}

async function saveDb(data: any) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database file", error);
  }
}

// Initialize Gemini client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client", err);
  }
} else {
  console.log("No GEMINI_API_KEY found in environment. Chat will run in local veterinary simulator mode.");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // ----------------------------------------------------
  // API Endpoints
  // ----------------------------------------------------

  // 1. Pets CRUD & Records
  app.get("/api/pets", async (req, res) => {
    const db = await loadDb();
    res.json(db.pets);
  });

  app.post("/api/pets", async (req, res) => {
    const db = await loadDb();
    const newPet = {
      id: `pet-${Date.now()}`,
      name: req.body.name || "Sem nome",
      type: req.body.type || "dog",
      breed: req.body.breed || "Vira-lata",
      age: req.body.age || "1 ano",
      ownerName: req.body.ownerName || "Cliente",
      weight: parseFloat(req.body.weight) || 5.0,
      avatar: req.body.avatar || (req.body.type === "cat" 
        ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300"
        : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300"),
      vaccinationHistory: req.body.vaccinationHistory || [],
      medicalHistory: req.body.medicalHistory || [],
      birthDate: req.body.birthDate || "",
      allergies: req.body.allergies || "",
      preExistingConditions: req.body.preExistingConditions || "",
      medicalSummary: req.body.medicalSummary || ""
    };
    db.pets.push(newPet);
    await saveDb(db);
    res.status(201).json(newPet);
  });

  app.put("/api/pets/:id", async (req, res) => {
    const db = await loadDb();
    const index = db.pets.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Pet não encontrado" });
    }
    db.pets[index] = { ...db.pets[index], ...req.body };
    await saveDb(db);
    res.json(db.pets[index]);
  });

  // Add a vaccination record to a pet
  app.post("/api/pets/:id/vaccines", async (req, res) => {
    const db = await loadDb();
    const index = db.pets.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Pet não encontrado" });
    }
    const newVaccine = {
      id: `vac-${Date.now()}`,
      name: req.body.name,
      dateAdministered: req.body.dateAdministered || new Date().toISOString().split("T")[0],
      status: req.body.status || "completed",
      batch: req.body.batch || "LOTE-S/N",
      veterinarian: req.body.veterinarian || "Dr. Carlos Silva",
      nextDoseDate: req.body.nextDoseDate || ""
    };
    db.pets[index].vaccinationHistory.push(newVaccine);
    await saveDb(db);
    res.status(201).json(db.pets[index]);
  });

  // Add a medical record to a pet
  app.post("/api/pets/:id/records", async (req, res) => {
    const db = await loadDb();
    const index = db.pets.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Pet não encontrado" });
    }
    const newRecord = {
      id: `med-${Date.now()}`,
      date: req.body.date || new Date().toISOString().split("T")[0],
      diagnosis: req.body.diagnosis || "Consulta Preventiva",
      treatment: req.body.treatment || "Nenhum tratamento necessário",
      veterinarian: req.body.veterinarian || "Dr. Carlos Silva",
      notes: req.body.notes || ""
    };
    db.pets[index].medicalHistory.push(newRecord);
    await saveDb(db);
    res.status(201).json(db.pets[index]);
  });

  // 2. Appointments API
  app.get("/api/appointments", async (req, res) => {
    const db = await loadDb();
    res.json(db.appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    const db = await loadDb();
    const newApp = {
      id: `app-${Date.now()}`,
      petId: req.body.petId,
      petName: req.body.petName,
      petType: req.body.petType || "dog",
      date: req.body.date,
      timeSlot: req.body.timeSlot,
      status: req.body.status || "scheduled",
      paymentStatus: req.body.paymentStatus || "pending",
      type: req.body.type || "consultation",
      cost: req.body.cost || 120,
      paymentMethod: req.body.paymentMethod || null,
      transactionId: req.body.transactionId || null
    };
    db.appointments.push(newApp);
    await saveDb(db);
    res.status(201).json(newApp);
  });

  // Process and Confirm Payment (integrated simulator)
  app.post("/api/appointments/:id/pay", async (req, res) => {
    const db = await loadDb();
    const appIndex = db.appointments.findIndex((a: any) => a.id === req.params.id);
    if (appIndex === -1) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    const method = req.body.paymentMethod || "pix";
    const transactionId = `TX-${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Update appointment
    db.appointments[appIndex].paymentStatus = "paid";
    db.appointments[appIndex].status = "scheduled";
    db.appointments[appIndex].paymentMethod = method;
    db.appointments[appIndex].transactionId = transactionId;

    // Automation: Add vaccine or medical record automatically upon paid appointment
    const targetAppointment = db.appointments[appIndex];
    const petIndex = db.pets.findIndex((p: any) => p.id === targetAppointment.petId);
    if (petIndex !== -1) {
      const pet = db.pets[petIndex];
      const today = new Date().toISOString().split("T")[0];

      if (targetAppointment.type === "vaccination") {
        // Auto append vaccine card pending or complete
        const targetVaccine = "V10 (Vanguard)";
        const nextDose = new Date();
        nextDose.setFullYear(nextDose.getFullYear() + 1);

        pet.vaccinationHistory.push({
          id: `vac-${Date.now()}`,
          name: "V10 (Vanguard) - Reforço",
          dateAdministered: today,
          status: "completed",
          batch: `LOTE-${Math.floor(100 + Math.random() * 900)}W`,
          veterinarian: "Dra. Ana Costa",
          nextDoseDate: nextDose.toISOString().split("T")[0]
        });
      }

      // Add a note to medical history about the paid booking
      pet.medicalHistory.unshift({
        id: `med-${Date.now()}`,
        date: today,
        diagnosis: `Consulta agendada de ${targetAppointment.type === "vaccination" ? "Vacinação" : targetAppointment.type === "checkup" ? "Check-up Geral" : "Consulta Geral"}`,
        treatment: `Pagamento processado via ${method.toUpperCase()} (${transactionId}). Aguardando atendimento no dia ${targetAppointment.date} às ${targetAppointment.timeSlot}.`,
        veterinarian: "Clínica Pet Clinica",
        notes: "Paciente registrado e confirmado no painel médico."
      });
    }

    await saveDb(db);
    res.json(db.appointments[appIndex]);
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    const db = await loadDb();
    const appIndex = db.appointments.findIndex((a: any) => a.id === req.params.id);
    if (appIndex === -1) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    db.appointments[appIndex].status = "cancelled";
    await saveDb(db);
    res.json(db.appointments[appIndex]);
  });

  // 3. Client Feedback
  app.get("/api/feedbacks", async (req, res) => {
    const db = await loadDb();
    res.json(db.feedbacks);
  });

  app.post("/api/feedbacks", async (req, res) => {
    const db = await loadDb();
    const newFeedback = {
      id: `fb-${Date.now()}`,
      author: req.body.author || "Cliente da Clínica",
      petName: req.body.petName || "Pet",
      petType: req.body.petType || "dog",
      rating: parseInt(req.body.rating) || 5,
      text: req.body.text || "Sem texto de feedback.",
      date: new Date().toISOString().split("T")[0],
      avatar: req.body.avatar || `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 10000)}?auto=format&fit=crop&q=80&w=100`
    };
    db.feedbacks.unshift(newFeedback);
    await saveDb(db);
    res.status(201).json(newFeedback);
  });

  // 4. PetGram Patient Feed
  app.get("/api/petgram", async (req, res) => {
    const db = await loadDb();
    res.json(db.petgram);
  });

  app.post("/api/petgram", async (req, res) => {
    const db = await loadDb();
    const newPost = {
      id: `post-${Date.now()}`,
      petName: req.body.petName || "Amiguinho",
      petType: req.body.petType || "dog",
      imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
      caption: req.body.caption || "Mais um paciente feliz na Pet Clinica! 🐾",
      likes: 0,
      comments: [],
      date: new Date().toISOString().split("T")[0],
      tag: req.body.tag || "Atendimento"
    };
    db.petgram.unshift(newPost);
    await saveDb(db);
    res.status(201).json(newPost);
  });

  app.post("/api/petgram/:id/like", async (req, res) => {
    const db = await loadDb();
    const postIndex = db.petgram.findIndex((p: any) => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post não encontrado" });
    }
    db.petgram[postIndex].likes += 1;
    await saveDb(db);
    res.json(db.petgram[postIndex]);
  });

  app.post("/api/petgram/:id/comments", async (req, res) => {
    const db = await loadDb();
    const postIndex = db.petgram.findIndex((p: any) => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post não encontrado" });
    }
    const newComment = {
      id: `c-${Date.now()}`,
      author: req.body.author || "Tutor de Pet",
      text: req.body.text || "",
      date: new Date().toISOString().split("T")[0]
    };
    db.petgram[postIndex].comments.push(newComment);
    await saveDb(db);
    res.status(201).json(db.petgram[postIndex]);
  });

  // 5. Veterinarian Smart Chat using Gemini
  app.get("/api/chats", async (req, res) => {
    const db = await loadDb();
    res.json(db.chats);
  });

  app.post("/api/chats", async (req, res) => {
    const db = await loadDb();
    const userMsg = {
      id: `chat-${Date.now()}`,
      sender: "user",
      text: req.body.text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
    db.chats.push(userMsg);

    // Save user message
    await saveDb(db);

    let responseText = "";

    if (ai) {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: userMsg.text,
          config: {
            systemInstruction: `
Você é o Dr. Carlos Silva (ou Dra. Ana Costa), o médico veterinário responsável pela clínica "Pet Clinica".
Sua clínica é especializada em cuidados com cães e gatos.
Sua missão é ajudar os tutores com dúvidas sobre comportamento, vacinação, nutrição e primeiros socorros de forma empática, profissional e acolhedora.
Siga estritamente estas regras:
1. Responda em português brasileiro.
2. Seja prestativo, use uma linguagem compreensível, mas profissional e tecnicamente correta.
3. Se o tutor relatar sintomas de gravidade (convulsões, sangramentos abundantes, vômitos persistentes, desidratação, dificuldade extrema para respirar ou perda de consciência), alerte-o para trazer o animal imediatamente para a Emergência 24h da Pet Clinica.
4. Explique a importância de vacinas recorrentes como a V10/Gripe para cães e V4/V5 para gatos.
5. AVISO OBRIGATÓRIO (DEVE CONSTAR NO FINAL DE TODA RESPOSTA): Adicione um bloco destacado lembrando que consultas online são apenas para orientação de bem-estar e cuidados, e jamais substituem a consulta veterinária presencial com exames físicos e clínicos.
Mantenha sua resposta objetiva, dividida em parágrafos limpos ou tópicos, com no máximo 150-200 palavras.
`,
            temperature: 0.7,
          }
        });
        
        responseText = result.text || "Desculpe, não consegui formular uma resposta médica no momento. Traga seu pet para nos ver!";
      } catch (err) {
        console.error("Gemini compilation error, using veterinary backup simulator", err);
        responseText = getRandomBackupResponse(userMsg.text);
      }
    } else {
      responseText = getRandomBackupResponse(userMsg.text);
    }

    const botMsg = {
      id: `chat-${Date.now() + 1}`,
      sender: "bot",
      text: responseText,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
    db.chats.push(botMsg);
    await saveDb(db);

    res.json({ userMessage: userMsg, botMessage: botMsg });
  });

  // Clear Chat history
  app.delete("/api/chats", async (req, res) => {
    const db = await loadDb();
    db.chats = [
      {
        id: "chat-1",
        sender: "bot",
        text: "Olá! Eu sou o Dr. Silva, o veterinário responsável da Pet Clinica. Como posso ajudar você e seu cãozinho ou gatinho hoje?",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      }
    ];
    await saveDb(db);
    res.json(db.chats);
  });

  // Fallback response simulator
  function getRandomBackupResponse(input: string): string {
    const normalized = input.toLowerCase();
    
    let answer = "";
    if (normalized.includes("vacina") || normalized.includes("vacinação") || normalized.includes("vax")) {
      answer = "Olá! Sobre vacinação: cães devem tomar a V10 (Vanguard) e a Anti-rábica anualmente. Já os gatos precisam da Quádrupla (V4) ou Quíntupla (V5) felina e também da Anti-rábica. Manter o histórico atualizado em nosso aplicativo protege seu pet de zoonoses graves e viroses. Recomendo agendar uma consulta de vacinação aqui mesmo pelo app!";
    } else if (normalized.includes("vomito") || normalized.includes("vômito") || normalized.includes("sangue") || normalized.includes("grave") || normalized.includes("dor")) {
      answer = "ATENÇÃO: Sintomas como vômitos frequentes, apatia profunda ou sangramentos podem indicar quadros graves de intoxicação, virose (como parvovirose) ou obstrução. Por favor, traga seu paciente imediatamente ao pronto atendimento 24h da Pet Clinica para que possamos examiná-lo presencialmente e realizar exames de imagem e sangue.";
    } else if (normalized.includes("comer") || normalized.includes("ração") || normalized.includes("comida") || normalized.includes("dieta")) {
      answer = "A alimentação equilibrada é a base da saúde do seu pet! Para filhotes, forneça ração Super Premium de crescimento. Para cães idosos, rações sênior ajudam nas articulações. Nunca forneça alimentos humanos proibidos como chocolate, cebola, uva ou alho, pois causam intoxicações severas.";
    } else {
      answer = "Olá! Compreendo sua dúvida sobre o bem-estar do seu pet. O cuidado diário, alimentação balanceada, higiene bucal e carinho são fundamentais para uma vida longa. Recomendo agendar um check-up preventivo conosco para darmos uma olhada geral na saúde física dele, atualizar as vacinas e tirar todas as suas dúvidas pessoalmente!";
    }

    return `${answer}\n\n*⚠️ Lembrete Importante: Esta resposta é uma orientação geral de saúde. Ela não substitui uma consulta física presencial com exame laboratorial com nossos veterinários na clínica física.*`;
  }

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
