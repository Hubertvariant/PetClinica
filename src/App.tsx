import React, { useState, useEffect } from 'react';
import { Pet, Appointment, Feedback, PetGramPost, ChatMessage } from './types';
import Dashboard from './components/Dashboard';
import Scheduling from './components/Scheduling';
import MedicalRecords from './components/MedicalRecords';
import PetGram from './components/PetGram';
import FeedbackView from './components/Feedback';
import ChatVet from './components/ChatVet';
import FinanceReports from './components/FinanceReports';

import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Calendar, 
  Camera, 
  ThumbsUp, 
  MessageSquare, 
  DollarSign, 
  HeartPulse,
  Menu,
  X,
  Bell,
  RefreshCw
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data State
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [posts, setPosts] = useState<PetGramPost[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [petsRes, appRes, postRes, feedRes, chatRes] = await Promise.all([
        fetch('/api/pets'),
        fetch('/api/appointments'),
        fetch('/api/petgram'),
        fetch('/api/feedbacks'),
        fetch('/api/chats')
      ]);

      if (!petsRes.ok || !appRes.ok || !postRes.ok || !feedRes.ok || !chatRes.ok) {
        throw new Error("Erro ao carregar dados do servidor.");
      }

      const petsData = await petsRes.json();
      const appData = await appRes.json();
      const postData = await postRes.json();
      const feedData = await feedRes.json();
      const chatData = await chatRes.json();

      setPets(petsData);
      setAppointments(appData);
      setPosts(postData);
      setFeedbacks(feedData);
      setMessages(chatData);

      if (petsData.length > 0 && !selectedPetId) {
        setSelectedPetId(petsData[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError("Falha na conexão com o servidor. Verifique o servidor local.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Post Request Handlers
  const handleAddPet = async (petData: Partial<Pet>) => {
    const res = await fetch('/api/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData)
    });
    if (!res.ok) throw new Error("Erro ao salvar pet");
    const newPet = await res.json();
    setPets(prev => [...prev, newPet]);
    return newPet;
  };

  const handleUpdatePet = async (id: string, petData: Partial<Pet>) => {
    const res = await fetch(`/api/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData)
    });
    if (!res.ok) throw new Error("Erro ao atualizar pet");
    const updatedPet = await res.json();
    setPets(prev => prev.map(p => p.id === id ? updatedPet : p));
    return updatedPet;
  };

  const handleAddVaccine = async (petId: string, vaccineData: Partial<Pet>) => {
    const res = await fetch(`/api/pets/${petId}/vaccines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaccineData)
    });
    if (!res.ok) throw new Error("Erro ao registrar vacina");
    const updatedPet = await res.json();
    setPets(prev => prev.map(p => p.id === petId ? updatedPet : p));
    return updatedPet;
  };

  const handleAddMedicalRecord = async (petId: string, recordData: any) => {
    const res = await fetch(`/api/pets/${petId}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData)
    });
    if (!res.ok) throw new Error("Erro ao adicionar prontuário");
    const updatedPet = await res.json();
    setPets(prev => prev.map(p => p.id === petId ? updatedPet : p));
    return updatedPet;
  };

  const handleAddAppointment = async (appData: Partial<Appointment>) => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    if (!res.ok) throw new Error("Erro ao agendar consulta");
    const newApp = await res.json();
    setAppointments(prev => [newApp, ...prev]);
    return newApp;
  };

  const handlePayAppointment = async (id: string, method: 'pix' | 'credit') => {
    const res = await fetch(`/api/appointments/${id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod: method })
    });
    if (!res.ok) throw new Error("Erro ao pagar consulta");
    const updatedApp = await res.json();
    
    // Update local appointment state
    setAppointments(prev => prev.map(app => app.id === id ? updatedApp : app));
    
    // Payments automatically trigger new vacc History entries if type is vaccination or consultation!
    // So we refresh pets data to sync the digital vaccine cards and records instantly.
    const petsRes = await fetch('/api/pets');
    if (petsRes.ok) {
      const petsData = await petsRes.json();
      setPets(petsData);
    }
    
    return updatedApp;
  };

  const handleCancelAppointment = async (id: string) => {
    const res = await fetch(`/api/appointments/${id}/cancel`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error("Erro ao cancelar consulta");
    const updatedApp = await res.json();
    setAppointments(prev => prev.map(app => app.id === id ? updatedApp : app));
    return updatedApp;
  };

  const handleLikePost = async (postId: string) => {
    const res = await fetch(`/api/petgram/${postId}/like`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error("Erro ao curtir");
    const updatedPost = await res.json();
    setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    return updatedPost;
  };

  const handleCommentPost = async (postId: string, author: string, text: string) => {
    const res = await fetch(`/api/petgram/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text })
    });
    if (!res.ok) throw new Error("Erro ao comentar");
    const updatedPost = await res.json();
    setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    return updatedPost;
  };

  const handleAddPost = async (postData: Partial<PetGramPost>) => {
    const res = await fetch('/api/petgram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error("Erro ao postar");
    const newPost = await res.json();
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const handleAddFeedback = async (feedData: Partial<Feedback>) => {
    const res = await fetch('/api/feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedData)
    });
    if (!res.ok) throw new Error("Erro ao salvar depoimento");
    const newFeed = await res.json();
    setFeedbacks(prev => [newFeed, ...prev]);
    return newFeed;
  };

  const handleSendMessage = async (text: string) => {
    // Add user message to state first
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error("Erro no chat");
    const data = await res.json();
    
    // Sync with returned backend response (which has user message AND bot message!)
    setMessages(data);
    return data;
  };

  const handleClearChat = async () => {
    const res = await fetch('/api/chats', {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error("Erro ao redefinir chat");
    setMessages([]);
  };

  // Nav Links Configuration
  const navLinks = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'patients', label: 'Prontuários & Vacinas', icon: ClipboardCheck },
    { id: 'scheduling', label: 'Agendar Online', icon: Calendar },
    { id: 'petgram', label: 'PetGram', icon: Camera },
    { id: 'feedback', label: 'Depoimentos', icon: ThumbsUp },
    { id: 'chat', label: 'Vet de Plantão', icon: MessageSquare },
    { id: 'finance', label: 'Gestão Financeira', icon: DollarSign },
  ];

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      
      {/* Top Banner / Navbar */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-40 shadow-xs px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B6B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-100 shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#2D3436] font-display leading-none">Pet<span className="text-[#FF6B6B]">Clinica</span></h1>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">Gestão Veterinária Integrada</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/65 p-1 rounded-xl border border-slate-200/50">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabSelect(link.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#FFF0F0] text-[#FF6B6B] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B6B]' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Secondary Header Items */}
          <div className="flex items-center gap-3">
            
            {/* Sync Status Button */}
            <button
              onClick={fetchAllData}
              title="Sincronizar banco de dados"
              disabled={loading}
              className="p-2 bg-slate-50 hover:bg-slate-100 border text-slate-500 rounded-xl transition-all cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-50 border rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t space-y-1 animate-slide-down">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabSelect(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive 
                      ? 'bg-[#FFF0F0] text-[#FF6B6B] border-l-4 border-[#FF6B6B]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#FF6B6B]' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {loading && pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Acessando prontuários e faturas...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4">
            <div className="inline-block p-4 bg-rose-50 text-rose-600 rounded-full">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Falha na Sincronização de Banco</p>
              <p className="text-xs text-slate-500 mt-1">{error}</p>
            </div>
            <button 
              onClick={fetchAllData}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl font-bold"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          /* Render Active Tab Component */
          <div className="space-y-6">
            
            {activeTab === 'dashboard' && (
              <Dashboard 
                pets={pets} 
                appointments={appointments} 
                onTabChange={handleTabSelect}
                onSelectPet={setSelectedPetId}
              />
            )}

            {activeTab === 'patients' && (
              <MedicalRecords 
                pets={pets}
                selectedPetId={selectedPetId}
                onSelectPet={setSelectedPetId}
                onAddPet={handleAddPet}
                onAddVaccine={handleAddVaccine}
                onAddMedicalRecord={handleAddMedicalRecord}
                onUpdatePet={handleUpdatePet}
              />
            )}

            {activeTab === 'scheduling' && (
              <Scheduling 
                pets={pets}
                appointments={appointments}
                onAddAppointment={handleAddAppointment}
                onPayAppointment={handlePayAppointment}
                onCancelAppointment={handleCancelAppointment}
              />
            )}

            {activeTab === 'petgram' && (
              <PetGram 
                posts={posts}
                onLikePost={handleLikePost}
                onCommentPost={handleCommentPost}
                onAddPost={handleAddPost}
              />
            )}

            {activeTab === 'feedback' && (
              <FeedbackView 
                feedbacks={feedbacks}
                onAddFeedback={handleAddFeedback}
              />
            )}

            {activeTab === 'chat' && (
              <ChatVet 
                messages={messages}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceReports 
                pets={pets}
                appointments={appointments}
              />
            )}

          </div>
        )}

      </main>

      {/* Footer credits */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 md:px-8 mt-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Pet Clinica. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span className="text-slate-350">CRMV/SP 8812</span>
            <span>•</span>
            <span className="text-indigo-500">Gestão 24 horas</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
