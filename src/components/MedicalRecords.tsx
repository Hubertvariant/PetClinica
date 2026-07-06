import React, { useState } from 'react';
import { Pet, Vaccine, MedicalRecord } from '../types';
import { HeartPulse, Syringe, FileText, Plus, User, Activity, AlertCircle, CheckCircle2, Clipboard, ChevronRight, Weight } from 'lucide-react';

interface MedicalRecordsProps {
  pets: Pet[];
  selectedPetId: string;
  onSelectPet: (id: string) => void;
  onAddPet: (pet: Partial<Pet>) => Promise<any>;
  onAddVaccine: (petId: string, vaccine: Partial<Vaccine>) => Promise<any>;
  onAddMedicalRecord: (petId: string, record: Partial<MedicalRecord>) => Promise<any>;
}

export default function MedicalRecords({ pets, selectedPetId, onSelectPet, onAddPet, onAddVaccine, onAddMedicalRecord }: MedicalRecordsProps) {
  // Navigation & Form views
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [showAddVaccineForm, setShowAddVaccineForm] = useState(false);
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);

  // New Pet Form State
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<'dog' | 'cat'>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetOwner, setNewPetOwner] = useState('');
  const [newPetWeight, setNewPetWeight] = useState('');

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
          : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300"
      });

      // Clear Form and select new pet
      setNewPetName('');
      setNewPetBreed('');
      setNewPetAge('');
      setNewPetOwner('');
      setNewPetWeight('');
      setShowAddPetForm(false);
      onSelectPet(addedPet.id);
    } catch (err) {
      console.error(err);
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

              {/* Vaccine and Medical Record Segmented Grid */}
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
                          <div key={m.id} className="p-3 bg-slate-55 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
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
