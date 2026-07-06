import React, { useState } from 'react';
import { Pet, Vaccine, MedicalRecord } from '../types';
import { 
  HeartPulse, 
  Syringe, 
  FileText, 
  Plus, 
  User, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clipboard, 
  ChevronRight, 
  Weight,
  Calendar,
  Edit,
  ShieldAlert,
  Info,
  Sparkles,
  Award
} from 'lucide-react';

interface MedicalRecordsProps {
  pets: Pet[];
  selectedPetId: string;
  onSelectPet: (id: string) => void;
  onAddPet: (pet: Partial<Pet>) => Promise<any>;
  onAddVaccine: (petId: string, vaccine: Partial<Vaccine>) => Promise<any>;
  onAddMedicalRecord: (petId: string, record: Partial<MedicalRecord>) => Promise<any>;
  onUpdatePet?: (id: string, pet: Partial<Pet>) => Promise<any>;
}

export default function MedicalRecords({ 
  pets, 
  selectedPetId, 
  onSelectPet, 
  onAddPet, 
  onAddVaccine, 
  onAddMedicalRecord,
  onUpdatePet
}: MedicalRecordsProps) {
  // Navigation & Form views
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [showAddVaccineForm, setShowAddVaccineForm] = useState(false);
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);
  
  // Tab control inside active pet view: 'profile' (Detailed Profile) or 'medical' (Vaccines/Records)
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'medical'>('profile');

  // New Pet Form State (Extended with requested detailed profile fields)
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<'dog' | 'cat'>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetOwner, setNewPetOwner] = useState('');
  const [newPetWeight, setNewPetWeight] = useState('');
  const [newPetBirthDate, setNewPetBirthDate] = useState('');
  const [newPetAllergies, setNewPetAllergies] = useState('');
  const [newPetPreExistingConditions, setNewPetPreExistingConditions] = useState('');
  const [newPetMedicalSummary, setNewPetMedicalSummary] = useState('');

  // Editing Pet Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editPetName, setEditPetName] = useState('');
  const [editPetType, setEditPetType] = useState<'dog' | 'cat'>('dog');
  const [editPetBreed, setEditPetBreed] = useState('');
  const [editPetAge, setEditPetAge] = useState('');
  const [editPetWeight, setEditPetWeight] = useState('');
  const [editPetOwner, setEditPetOwner] = useState('');
  const [editPetBirthDate, setEditPetBirthDate] = useState('');
  const [editPetAllergies, setEditPetAllergies] = useState('');
  const [editPetPreExistingConditions, setEditPetPreExistingConditions] = useState('');
  const [editPetMedicalSummary, setEditPetMedicalSummary] = useState('');

  // New Vaccine Form State
  const [vacName, setVacName] = useState('');
  const [vacBatch, setVacBatch] = useState('');
  const [vacVet, setVacVet] = useState('Dr. Carlos Silva');
  const [vacNextDate, setVacNextDate] = useState('');

  // New Medical Record Form State
  const [recDiagnosis, setRecDiagnosis] = useState('');
  const [recTreatment, setRecTreatment] = useState('');
  const [recNotes, setRecNotes] = useState('');
  const [recVet, setRecVet] = useState('Dr. Carlos Silva');

  const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];

  const handleAddPetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName || !newPetBreed || !newPetAge || !newPetOwner || !newPetWeight) {
      alert("Por favor, preencha todos os campos para cadastrar o animal.");
      return;
    }

    try {
      const addedPet = await onAddPet({
        name: newPetName,
        type: newPetType,
        breed: newPetBreed,
        age: newPetAge,
        ownerName: newPetOwner,
        weight: parseFloat(newPetWeight),
        avatar: newPetType === 'cat' 
          ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300"
          : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300",
        birthDate: newPetBirthDate,
        allergies: newPetAllergies,
        preExistingConditions: newPetPreExistingConditions,
        medicalSummary: newPetMedicalSummary
      });

      // Clear Form and select new pet
      setNewPetName('');
      setNewPetBreed('');
      setNewPetAge('');
      setNewPetOwner('');
      setNewPetWeight('');
      setNewPetBirthDate('');
      setNewPetAllergies('');
      setNewPetPreExistingConditions('');
      setNewPetMedicalSummary('');
      setShowAddPetForm(false);
      onSelectPet(addedPet.id);
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = () => {
    if (!selectedPet) return;
    setEditPetName(selectedPet.name);
    setEditPetType(selectedPet.type);
    setEditPetBreed(selectedPet.breed);
    setEditPetAge(selectedPet.age);
    setEditPetWeight(selectedPet.weight.toString());
    setEditPetOwner(selectedPet.ownerName);
    setEditPetBirthDate(selectedPet.birthDate || '');
    setEditPetAllergies(selectedPet.allergies || '');
    setEditPetPreExistingConditions(selectedPet.preExistingConditions || '');
    setEditPetMedicalSummary(selectedPet.medicalSummary || '');
    setIsEditingProfile(true);
  };

  const handleUpdatePetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !onUpdatePet) return;
    try {
      await onUpdatePet(selectedPet.id, {
        name: editPetName,
        type: editPetType,
        breed: editPetBreed,
        age: editPetAge,
        ownerName: editPetOwner,
        weight: parseFloat(editPetWeight) || 0,
        birthDate: editPetBirthDate,
        allergies: editPetAllergies,
        preExistingConditions: editPetPreExistingConditions,
        medicalSummary: editPetMedicalSummary
      });
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar o perfil.");
    }
  };

  const handleAddVaccineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacName || !selectedPet) return;

    try {
      await onAddVaccine(selectedPet.id, {
        name: vacName,
        batch: vacBatch || 'LOTE-S/N',
        veterinarian: vacVet,
        nextDoseDate: vacNextDate || undefined,
        status: 'completed'
      });

      setVacName('');
      setVacBatch('');
      setVacNextDate('');
      setShowAddVaccineForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recDiagnosis || !selectedPet) return;

    try {
      await onAddMedicalRecord(selectedPet.id, {
        diagnosis: recDiagnosis,
        treatment: recTreatment || 'Consulta preventiva/Orientações gerais',
        notes: recNotes,
        veterinarian: recVet
      });

      setRecDiagnosis('');
      setRecTreatment('');
      setRecNotes('');
      setShowAddRecordForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" id="medical-records-view">
      
      {/* Upper Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-1.5">
            <Clipboard className="w-5 h-5 text-indigo-600" />
            Prontuários Digitais & Vacinação
          </h2>
          <p className="text-xs text-slate-500 mt-1">Prontuários eletrônicos completos com controle de lote e datas de imunização para cães e gatos.</p>
        </div>

        <button
          onClick={() => {
            setShowAddPetForm(true);
            setShowAddVaccineForm(false);
            setShowAddRecordForm(false);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Admitir Novo Pet (Paciente)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Patients Sidebar (List) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Diretório de Pacientes</h3>
          
          <div className="space-y-2 overflow-y-auto max-h-[520px] pr-1">
            {pets.map(p => {
              const isActive = selectedPet && selectedPet.id === p.id;
              const completedVacCount = p.vaccinationHistory.filter(v => v.status === 'completed').length;
              
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPet(p.id);
                    setShowAddPetForm(false);
                    setShowAddVaccineForm(false);
                    setShowAddRecordForm(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                    isActive 
                      ? 'border-indigo-600 bg-indigo-50/45 text-indigo-800 ring-2 ring-indigo-100'
                      : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={p.avatar} 
                      alt={p.name} 
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-800">{p.name}</span>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase">
                          {p.type === 'dog' ? '🐶' : '🐱'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{p.breed} • {p.age}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50/40 px-2 py-0.5 rounded-full">
                    <span>{completedVacCount} vacinas</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Central Display / Form (Right Panel) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col min-h-[500px]">
          
          {/* Form: Add Patient (Pet) */}
          {showAddPetForm ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 font-display">Admitir Novo Paciente</h3>
                <button 
                  onClick={() => setShowAddPetForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleAddPetSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Pet</label>
                    <input
                      type="text"
                      value={newPetName}
                      onChange={(e) => setNewPetName(e.target.value)}
                      placeholder="Ex: Rex"
                      className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none font-semibold text-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Espécie</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewPetType('dog')}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          newPetType === 'dog'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                            : 'border-slate-100 bg-slate-50 text-slate-600'
                        }`}
                      >
                        🐶 Cão / Cachorro
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPetType('cat')}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          newPetType === 'cat'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                            : 'border-slate-100 bg-slate-50 text-slate-600'
                        }`}
                      >
                        🐱 Gato / Felino
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Raça</label>
                    <input
                      type="text"
                      value={newPetBreed}
                      onChange={(e) => setNewPetBreed(e.target.value)}
                      placeholder="Ex: Persa, Pug, SRD"
                      className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Idade</label>
                    <input
                      type="text"
                      value={newPetAge}
                      onChange={(e) => setNewPetAge(e.target.value)}
                      placeholder="Ex: 2 anos, 6 meses"
                      className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPetWeight}
                      onChange={(e) => setNewPetWeight(e.target.value)}
                      placeholder="Ex: 8.5"
                      className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Tutor (Responsável)</label>
                  <input
                    type="text"
                    value={newPetOwner}
                    onChange={(e) => setNewPetOwner(e.target.value)}
                    placeholder="Ex: Maria Medeiros"
                    className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data de Nascimento</label>
                    <input
                      type="date"
                      value={newPetBirthDate}
                      onChange={(e) => setNewPetBirthDate(e.target.value)}
                      className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Histórico de Alergias</label>
                    <input
                      type="text"
                      value={newPetAllergies}
                      onChange={(e) => setNewPetAllergies(e.target.value)}
                      placeholder="Ex: Picada de pulga, dipirona..."
                      className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Condições Médicas Preexistentes</label>
                  <input
                    type="text"
                    value={newPetPreExistingConditions}
                    onChange={(e) => setNewPetPreExistingConditions(e.target.value)}
                    placeholder="Ex: Cardiopatia grau I, displasia coxofemoral..."
                    className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resumo do Histórico Médico Geral</label>
                  <textarea
                    rows={2}
                    value={newPetMedicalSummary}
                    onChange={(e) => setNewPetMedicalSummary(e.target.value)}
                    placeholder="Resumo clínico inicial, observações gerais sobre a saúde do animal..."
                    className="w-full bg-slate-50 border hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Registrar e Salvar Ficha Clínica
                </button>
              </form>
            </div>
          ) : selectedPet ? (
            /* Selected Pet Clinical Profile View */
            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Pet Quick Stats Profile Card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedPet.avatar} 
                    alt={selectedPet.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-600 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-lg font-bold text-slate-800 font-display">{selectedPet.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                        selectedPet.type === 'dog' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {selectedPet.type === 'dog' ? 'Cão' : 'Gato'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Raça: <span className="font-semibold text-slate-700">{selectedPet.breed}</span> • Tutor(a): <span className="font-semibold text-slate-700">{selectedPet.ownerName}</span></p>
                  </div>
                </div>

                <div className="flex gap-4 sm:border-l sm:pl-4 border-slate-250">
                  <div className="text-center font-mono">
                    <p className="text-[10px] text-slate-400 font-sans font-bold uppercase">Idade</p>
                    <p className="font-bold text-sm text-slate-700 mt-0.5">{selectedPet.age}</p>
                  </div>
                  <div className="text-center font-mono">
                    <p className="text-[10px] text-slate-400 font-sans font-bold uppercase flex items-center justify-center gap-0.5">
                      <Weight className="w-3.5 h-3.5 text-slate-400" />
                      Peso
                    </p>
                    <p className="font-bold text-sm text-slate-700 mt-0.5">{selectedPet.weight} kg</p>
                  </div>
                </div>
              </div>

               {/* Sub-Tab Navigation inside active pet display */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab('profile');
                    setIsEditingProfile(false);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSubTab === 'profile'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-850'
                  }`}
                >
                  <User className="w-4 h-4 text-[#FF6B6B]" />
                  Ficha Detalhada & Perfil
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab('medical');
                    setIsEditingProfile(false);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSubTab === 'medical'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-850'
                  }`}
                >
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Vacinas & Histórico Clínico
                </button>
              </div>

              {/* PROFILE SUBTAB */}
              {activeSubTab === 'profile' && (
                isEditingProfile ? (
                  <form onSubmit={handleUpdatePetSubmit} className="space-y-4 bg-white p-5 rounded-xl border border-slate-100 flex-1">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <Edit className="w-4 h-4 text-indigo-600" />
                        Editar Ficha Clínica: {selectedPet.name}
                      </h5>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome do Pet</label>
                        <input
                          type="text"
                          value={editPetName}
                          onChange={(e) => setEditPetName(e.target.value)}
                          className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Espécie</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setEditPetType('dog')}
                            className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                              editPetType === 'dog'
                                ? 'border-indigo-600 bg-[#FFF0F0] text-[#FF6B6B]'
                                : 'border-slate-100 bg-slate-50 text-slate-600'
                            }`}
                          >
                            🐶 Cão
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditPetType('cat')}
                            className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                              editPetType === 'cat'
                                ? 'border-indigo-600 bg-[#FFF0F0] text-[#FF6B6B]'
                                : 'border-slate-100 bg-slate-50 text-slate-600'
                            }`}
                          >
                            🐱 Gato
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Raça</label>
                        <input
                          type="text"
                          value={editPetBreed}
                          onChange={(e) => setEditPetBreed(e.target.value)}
                          className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Idade</label>
                        <input
                          type="text"
                          value={editPetAge}
                          onChange={(e) => setEditPetAge(e.target.value)}
                          className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editPetWeight}
                          onChange={(e) => setEditPetWeight(e.target.value)}
                          className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome do Tutor</label>
                        <input
                          type="text"
                          value={editPetOwner}
                          onChange={(e) => setEditPetOwner(e.target.value)}
                          className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Data de Nascimento</label>
                        <input
                          type="date"
                          value={editPetBirthDate}
                          onChange={(e) => setEditPetBirthDate(e.target.value)}
                          className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Histórico de Alergias</label>
                      <input
                        type="text"
                        value={editPetAllergies}
                        onChange={(e) => setEditPetAllergies(e.target.value)}
                        placeholder="Ex: Picada de pulga, dipirona, proteína de frango..."
                        className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Condições Médicas Preexistentes</label>
                      <input
                        type="text"
                        value={editPetPreExistingConditions}
                        onChange={(e) => setEditPetPreExistingConditions(e.target.value)}
                        placeholder="Ex: Sopro cardíaco leve, displasia..."
                        className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Resumo do Histórico Médico Geral</label>
                      <textarea
                        rows={3}
                        value={editPetMedicalSummary}
                        onChange={(e) => setEditPetMedicalSummary(e.target.value)}
                        placeholder="Resumo geral das condições de saúde do animal ao longo da vida..."
                        className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6 flex-1 bg-white p-5 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <User className="w-4 h-4 text-[#FF6B6B]" />
                        Ficha Clínica & Detalhes do Pet
                      </h5>
                      <button
                        onClick={startEditing}
                        className="bg-[#FFF0F0] text-[#FF6B6B] hover:bg-[#FFE3E3] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Editar Dados
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data de Nascimento</p>
                        <p className="font-bold text-xs text-slate-700 mt-1.5 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          {selectedPet.birthDate 
                            ? new Date(selectedPet.birthDate + 'T00:00:00').toLocaleDateString('pt-BR') 
                            : 'Não registrada'}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Idade Estimada</p>
                        <p className="font-bold text-xs text-slate-700 mt-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          {selectedPet.age}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peso Atual</p>
                        <p className="font-bold text-xs text-slate-700 mt-1.5 flex items-center gap-1.5">
                          <Weight className="w-4 h-4 text-emerald-500" />
                          {selectedPet.weight} kg
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100/40">
                        <h6 className="text-xs font-bold text-rose-700 flex items-center gap-1.5 uppercase tracking-wide">
                          <ShieldAlert className="w-4 h-4 text-rose-500" />
                          Histórico de Alergias
                        </h6>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {selectedPet.allergies || 'Nenhuma alergia relatada pelo tutor até o momento.'}
                        </p>
                      </div>

                      <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100/40">
                        <h6 className="text-xs font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wide">
                          <Info className="w-4 h-4 text-amber-500" />
                          Condições Preexistentes
                        </h6>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {selectedPet.preExistingConditions || 'Nenhuma condição clínica ou cirúrgica preexistente relatada.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/80">
                      <h6 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <Clipboard className="w-4 h-4 text-indigo-500" />
                        Resumo do Histórico Médico Geral
                      </h6>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line font-medium">
                        {selectedPet.medicalSummary || 'Nenhum resumo clínico geral cadastrado para este pet. Clique em Editar Dados para adicionar informações.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Espécie</p>
                        <p className="font-extrabold text-xs text-slate-700 mt-0.5">{selectedPet.type === 'dog' ? '🐶 Cão' : '🐱 Gato'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Raça</p>
                        <p className="font-extrabold text-xs text-slate-700 mt-0.5">{selectedPet.breed}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Tutor(a)</p>
                        <p className="font-extrabold text-xs text-slate-700 mt-0.5">{selectedPet.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Status Clínico</p>
                        <p className="font-extrabold text-xs text-emerald-600 mt-0.5 flex items-center justify-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ativo
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* MEDICAL (VACCINES & RECORDS) SUBTAB */}
              {activeSubTab === 'medical' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  
                  {/* Vaccination Card */}
                  <div className="space-y-4 flex flex-col">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <Syringe className="w-4 h-4 text-indigo-600" />
                        Carteira de Vacinas
                      </h5>
                      
                      {!showAddVaccineForm && (
                        <button
                          onClick={() => {
                            setShowAddVaccineForm(true);
                            setShowAddRecordForm(false);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Registrar Dose
                        </button>
                      )}
                    </div>

                    {showAddVaccineForm ? (
                      <form onSubmit={handleAddVaccineSubmit} className="bg-slate-50 p-4 rounded-xl border space-y-3">
                        <p className="text-xs font-bold text-slate-700">Registrar Dose Aplicada</p>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nome da Vacina</label>
                          <input
                            type="text"
                            value={vacName}
                            onChange={(e) => setVacName(e.target.value)}
                            placeholder="Ex: V10, Antirrábica, V4"
                            className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 text-slate-750"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Lote</label>
                            <input
                              type="text"
                              value={vacBatch}
                              onChange={(e) => setVacBatch(e.target.value)}
                              placeholder="Ex: LAB-992X"
                              className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Reforço (Próxima Dose)</label>
                            <input
                              type="date"
                              value={vacNextDate}
                              onChange={(e) => setVacNextDate(e.target.value)}
                              className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Veterinário Responsável</label>
                          <select
                            value={vacVet}
                            onChange={(e) => setVacVet(e.target.value)}
                            className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none text-slate-700 font-semibold"
                          >
                            <option value="Dr. Carlos Silva">Dr. Carlos Silva</option>
                            <option value="Dra. Ana Costa">Dra. Ana Costa</option>
                          </select>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddVaccineForm(false)}
                            className="flex-1 bg-white hover:bg-slate-100 text-slate-600 py-1.5 rounded-lg text-xs font-semibold border"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-bold"
                          >
                            Salvar Registro
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1 flex-1">
                        {selectedPet.vaccinationHistory && selectedPet.vaccinationHistory.length > 0 ? (
                          selectedPet.vaccinationHistory.map(v => (
                            <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <p className="font-bold text-xs text-slate-800">{v.name}</p>
                                <p className="text-[10px] text-slate-400">Lote: <span className="font-semibold text-slate-600">{v.batch}</span> • {v.veterinarian}</p>
                                <p className="text-[10px] text-slate-500">Dose em: {new Date(v.dateAdministered + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                              </div>

                              <div className="text-right flex flex-col items-end gap-1.5">
                                {v.status === 'completed' ? (
                                  <span className="flex items-center gap-0.5 text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">
                                    <CheckCircle2 className="w-3 h-3" /> Aplicada
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-0.5 text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase">
                                    <AlertCircle className="w-3 h-3" /> Pendente
                                  </span>
                                )}

                                {v.nextDoseDate && (
                                  <span className="text-[9px] text-slate-500 font-semibold bg-white border px-1.5 py-0.2 rounded">
                                    Reforço: {new Date(v.nextDoseDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-450 text-center py-10">Nenhuma vacina aplicada.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Progress Notes & Digital Records */}
                  <div className="space-y-4 flex flex-col">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Prontuário Médico
                      </h5>
                      
                      {!showAddRecordForm && (
                        <button
                          onClick={() => {
                            setShowAddRecordForm(true);
                            setShowAddVaccineForm(false);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Evolução
                        </button>
                      )}
                    </div>

                    {showAddRecordForm ? (
                      <form onSubmit={handleAddRecordSubmit} className="bg-slate-50 p-4 rounded-xl border space-y-3">
                        <p className="text-xs font-bold text-slate-700">Registrar Evolução Clínica</p>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Diagnóstico / Motivo</label>
                          <input
                            type="text"
                            value={recDiagnosis}
                            onChange={(e) => setRecDiagnosis(e.target.value)}
                            placeholder="Ex: Otite Externa, Limpeza Geral"
                            className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Tratamento Prescrito</label>
                          <textarea
                            rows={2}
                            value={recTreatment}
                            onChange={(e) => setRecTreatment(e.target.value)}
                            placeholder="Medicamentos, posologia, orientações diárias..."
                            className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Observações Clínicas</label>
                          <input
                            type="text"
                            value={recNotes}
                            onChange={(e) => setRecNotes(e.target.value)}
                            placeholder="Recomendações extras de retornos..."
                            className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Veterinário Responsável</label>
                          <select
                            value={recVet}
                            onChange={(e) => setRecVet(e.target.value)}
                            className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none text-slate-750 font-semibold"
                          >
                            <option value="Dr. Carlos Silva">Dr. Carlos Silva</option>
                            <option value="Dra. Ana Costa">Dra. Ana Costa</option>
                          </select>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddRecordForm(false)}
                            className="flex-1 bg-white hover:bg-slate-100 text-slate-600 py-1.5 rounded-lg text-xs font-semibold border"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-bold"
                          >
                            Adicionar Prontuário
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1 flex-1">
                        {selectedPet.medicalHistory && selectedPet.medicalHistory.length > 0 ? (
                          selectedPet.medicalHistory.map(m => (
                            <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs text-slate-800">{m.diagnosis}</span>
                                <span className="text-[10px] font-mono text-indigo-600 font-semibold bg-indigo-50 px-1.5 rounded">{new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed"><strong>Tratamento:</strong> {m.treatment}</p>
                              {m.notes && (
                                <p className="text-[11px] text-slate-500 italic"><strong>Nota:</strong> {m.notes}</p>
                              )}
                              <p className="text-[10px] text-slate-400 font-medium">Veterinário: {m.veterinarian}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-450 text-center py-10">Nenhum prontuário registrado ainda.</p>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center flex-1">
              <Clipboard className="w-12 h-12 text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">Nenhum pet selecionado</p>
              <p className="text-xs mt-1">Selecione um paciente na lista ou admita um novo pet no botão acima.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
