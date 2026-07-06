import React, { useState } from 'react';
import { Pet, Appointment } from '../types';
import { Calendar, Clock, DollarSign, CheckCircle2, AlertCircle, Copy, Check, CreditCard, ShieldCheck } from 'lucide-react';

interface SchedulingProps {
  pets: Pet[];
  appointments: Appointment[];
  onAddAppointment: (appointment: Partial<Appointment>) => Promise<any>;
  onPayAppointment: (id: string, method: 'pix' | 'credit') => Promise<any>;
  onCancelAppointment: (id: string) => Promise<any>;
}

export default function Scheduling({ pets, appointments, onAddAppointment, onPayAppointment, onCancelAppointment }: SchedulingProps) {
  // Booking Form State
  const [selectedPetId, setSelectedPetId] = useState('');
  const [bookingType, setBookingType] = useState<'consultation' | 'vaccination' | 'checkup' | 'emergency'>('consultation');
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Checkout State
  const [activeCheckoutApp, setActiveCheckoutApp] = useState<Appointment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit'>('pix');
  const [pixCopied, setPixCopied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Credit Card Form
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Costs mapping
  const costMap = {
    consultation: 150,
    vaccination: 90,
    checkup: 120,
    emergency: 250
  };

  const typeLabels = {
    consultation: 'Consulta Geral',
    vaccination: 'Vacinação & Dose',
    checkup: 'Check-up Preventivo',
    emergency: 'Plantão Emergência'
  };

  // Time Slots
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Calculate disabled slots for the selected date
  const bookedSlotsForDate = appointments
    .filter(app => app.date === bookingDate && app.status !== 'cancelled')
    .map(app => app.timeSlot);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !bookingDate || !selectedSlot) {
      alert("Por favor, preencha todos os campos do agendamento.");
      return;
    }

    const pet = pets.find(p => p.id === selectedPetId);
    if (!pet) return;

    try {
      const newApp = await onAddAppointment({
        petId: pet.id,
        petName: pet.name,
        petType: pet.type,
        date: bookingDate,
        timeSlot: selectedSlot,
        type: bookingType,
        cost: costMap[bookingType],
        status: 'pending_payment',
        paymentStatus: 'pending'
      });

      // Clear form
      setSelectedSlot('');
      
      // Auto open Checkout for the newly created booking
      setActiveCheckoutApp(newApp);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProcessPayment = async () => {
    if (!activeCheckoutApp) return;

    if (paymentMethod === 'credit') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
        alert("Preencha todos os dados do cartão de crédito.");
        return;
      }
    }

    setIsProcessingPayment(true);
    
    // Simulate brief payment gateway lag
    setTimeout(async () => {
      try {
        await onPayAppointment(activeCheckoutApp.id, paymentMethod);
        setIsProcessingPayment(false);
        setActiveCheckoutApp(null);
        // Clear card fields
        setCardName('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
      } catch (err) {
        setIsProcessingPayment(false);
        console.error(err);
      }
    }, 1500);
  };

  const copyPixKey = () => {
    const pixKey = "pix-key-clinica-pet-clinica-7ddda039-44a7-40ec-b4a1-ef2542014dc8";
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  // Filter out completed and scheduled appointments for display
  const activeBookings = appointments.filter(app => app.status !== 'completed');

  return (
    <div className="space-y-6" id="scheduling-view">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Booking Form (Left Panel) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col space-y-4">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Agendar Consulta Online
            </h2>
            <p className="text-xs text-slate-500 mt-1">Escolha seu pet, a data e horário disponíveis. O pagamento integrado Pix/Card confirma na hora.</p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Choose Pet */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Escolha o Paciente</label>
              {pets.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {pets.map(pet => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center gap-1.5 cursor-pointer ${
                        selectedPetId === pet.id 
                          ? 'border-indigo-600 bg-indigo-50/55 text-indigo-700 ring-2 ring-indigo-100'
                          : 'border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <img 
                        src={pet.avatar} 
                        alt={pet.name} 
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100';
                        }}
                      />
                      <span className="font-bold text-xs truncate max-w-full">{pet.name}</span>
                      <span className="text-[9px] uppercase font-semibold text-slate-400">{pet.type === 'dog' ? '🐶 Cão' : '🐱 Gato'}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  Nenhum pet cadastrado. Adicione um na aba "Pacientes" antes de agendar.
                </div>
              )}
            </div>

            {/* Choose Consultation Type */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Tipo de Procedimento</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(costMap) as Array<keyof typeof costMap>).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBookingType(type)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      bookingType === type 
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 ring-2 ring-indigo-100'
                        : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {type === 'vaccination' ? '💉' : type === 'checkup' ? '🩺' : type === 'emergency' ? '🚨' : '🏥'}
                      </span>
                      <div className="text-left">
                        <p className="font-bold text-xs">{typeLabels[type]}</p>
                        <p className="text-[10px] text-slate-400">Excelente acompanhamento</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs font-mono">R$ {costMap[type]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Data</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setBookingDate(e.target.value);
                    setSelectedSlot(''); // Reset slot on date change
                  }}
                  className="w-full bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none text-slate-700 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Horário da Agenda</label>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Escolha a data para liberar horários</span>
                </div>
              </div>
            </div>

            {/* Slots Picker */}
            {bookingDate && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Horários Disponíveis para {new Date(bookingDate + 'T00:00:00').toLocaleDateString('pt-BR')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(slot => {
                    const isBooked = bookedSlotsForDate.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          isBooked 
                            ? 'bg-slate-100 text-slate-350 border-slate-100 cursor-not-allowed opacity-50 font-normal line-through'
                            : selectedSlot === slot
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:bg-indigo-50/20'
                        }`}
                      >
                        {slot} {isBooked ? '(Ocupado)' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              Agendar e Prosseguir para Pagamento (R$ {costMap[bookingType]})
            </button>
          </form>
        </div>

        {/* Real-time Status and Bookings List (Right Panel) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col space-y-4">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Sessões Agendadas
            </h2>
            <p className="text-xs text-slate-500 mt-1">Monitore o status do agendamento, faturas pendentes e faça cancelamentos de forma transparente.</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 flex-1">
            {activeBookings.length > 0 ? (
              activeBookings.map(app => (
                <div key={app.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-all flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-800">{app.petName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold text-white uppercase ${
                          app.petType === 'dog' ? 'bg-blue-500' : 'bg-pink-500'
                        }`}>
                          {app.petType === 'dog' ? 'Cão' : 'Gato'}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{typeLabels[app.type]}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700 font-mono">R$ {app.cost}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(app.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {app.timeSlot}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.status === 'scheduled' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {app.status === 'scheduled' ? 'Confirmado' : 'Aguardando Pgto'}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {app.paymentStatus === 'pending' && (
                      <button
                        onClick={() => setActiveCheckoutApp(app)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] py-1.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pagar Agora
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja cancelar o agendamento de ${app.petName}?`)) {
                          onCancelAppointment(app.id);
                        }
                      }}
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-bold px-2 py-1 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mb-2 stroke-1 animate-pulse" />
                <p className="font-semibold text-slate-600">Nenhuma consulta ativa</p>
                <p className="text-xs max-w-xs mt-1">Selecione o pet, a data e agende agora mesmo seu atendimento online!</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Embedded Integrated Payment Modal/Panel */}
      {activeCheckoutApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-md w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveCheckoutApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>

            {/* Modal Title */}
            <div className="text-center">
              <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Gestão Financeira Integrada
              </span>
              <h3 className="text-lg font-bold font-display text-slate-800 mt-2">
                Checkout - Confirmar Agendamento
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Paciente: <span className="font-semibold text-slate-600">{activeCheckoutApp.petName}</span> • Procedimento: <span className="font-semibold text-slate-600">{typeLabels[activeCheckoutApp.type]}</span>
              </p>
            </div>

            {/* Total display */}
            <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100 font-mono">
              <span className="text-xs font-sans font-bold text-slate-500 uppercase">Total a Pagar</span>
              <span className="text-xl font-bold text-slate-800">R$ {activeCheckoutApp.cost}</span>
            </div>

            {/* Payment Methods Tabs */}
            <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setPaymentMethod('pix')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-indigo-600 bg-indigo-50/55 text-indigo-700'
                    : 'border-slate-150 text-slate-500 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                💸 Copiar Chave Pix
              </button>
              <button
                onClick={() => setPaymentMethod('credit')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  paymentMethod === 'credit'
                    ? 'border-indigo-600 bg-indigo-50/55 text-indigo-700'
                    : 'border-slate-150 text-slate-500 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                💳 Cartão de Crédito
              </button>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'pix' ? (
              <div className="space-y-4 flex flex-col items-center">
                {/* Simulated QR Code */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col items-center gap-2">
                  <div className="w-36 h-36 bg-white border border-slate-300 p-2 rounded flex items-center justify-center">
                    {/* Simulated vector graphic QR code using CSS */}
                    <div className="grid grid-cols-4 gap-1.5 w-full h-full opacity-80">
                      {[...Array(16)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`rounded-sm ${
                            (i % 3 === 0 || i % 5 === 0 || i === 0 || i === 15) ? 'bg-indigo-900' : 'bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Escaneie o Pix Code</span>
                </div>

                <div className="w-full space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Chave de Copia-e-Cola</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="pix-key-clinica-pet-clinica-7ddda039-44a7-40ec-b4a1-ef2542014dc8"
                      className="flex-1 bg-slate-50 border text-slate-600 rounded-xl px-3 py-2 text-[10px] font-mono outline-none"
                    />
                    <button
                      onClick={copyPixKey}
                      className="bg-slate-100 hover:bg-indigo-55 hover:bg-indigo-100 text-indigo-600 px-3.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer"
                    >
                      {pixCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome no Cartão</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="JOAO A SILVA"
                    className="w-full bg-slate-50 border hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs outline-none uppercase font-semibold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19))}
                    placeholder="4444 5555 6666 7777"
                    className="w-full bg-slate-50 border hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs outline-none font-mono text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vencimento</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})/g, '$1/').substring(0, 5))}
                      placeholder="12/29"
                      className="w-full bg-slate-50 border hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs outline-none font-mono text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CVC / Código</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="***"
                      className="w-full bg-slate-50 border hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs outline-none font-mono text-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Safeguard */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Transação protegida por criptografia SSL. Os dados do cartão são processados em sandbox simulado 100% seguro.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveCheckoutApp(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all text-center"
              >
                Pagar Depois
              </button>
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:bg-emerald-400"
              >
                {isProcessingPayment ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Validando transação...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmar Pagamento
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
