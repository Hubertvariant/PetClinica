import React, { useState } from 'react';
import { Pet, Appointment } from '../types';
import { Calendar, Syringe, MessageSquare, HeartPulse, Bell, Activity, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardProps {
  pets: Pet[];
  appointments: Appointment[];
  onTabChange: (tab: string) => void;
  onSelectPet: (petId: string) => void;
}

export default function Dashboard({ pets, appointments, onTabChange, onSelectPet }: DashboardProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Statistics calculations
  const totalPets = pets.length;
  const dogsCount = pets.filter(p => p.type === 'dog').length;
  const catsCount = pets.filter(p => p.type === 'cat').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(app => app.date === todayStr && app.status !== 'cancelled');
  const pendingPaymentsCount = appointments.filter(app => app.paymentStatus === 'pending' && app.status !== 'cancelled').length;

  // Vaccine alerts (pending vaccines across all pets)
  const vaccineAlerts = pets.flatMap(pet => 
    pet.vaccinationHistory
      .filter(v => v.status === 'pending')
      .map(v => ({
        petId: pet.id,
        petName: pet.name,
        petType: pet.type,
        avatar: pet.avatar,
        vaccineName: v.name,
        dueDate: v.nextDoseDate || 'Em breve',
      }))
  );

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          new Notification("Pet Clinica", {
            body: "Notificações push ativadas! Lembraremos você das próximas vacinas e retornos.",
            icon: "/favicon.ico"
          });
        } else {
          // Simulation fallback for iframe/local environment
          setNotificationsEnabled(true);
          setShowNotificationToast(true);
          setTimeout(() => setShowNotificationToast(false), 4000);
        }
      });
    } else {
      setNotificationsEnabled(true);
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 4000);
    }
  };

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Simulation Notification */}
      {showNotificationToast && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <Bell className="text-yellow-400 w-5 h-5 animate-swing" />
          <div>
            <p className="font-semibold text-sm">Lembretes Ativados!</p>
            <p className="text-xs text-slate-300">Você receberá avisos automáticos de retornos e vacinas.</p>
          </div>
        </div>
      )}

      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Olá, Veterinário & Tutor!</h1>
          <p className="text-slate-500 text-sm mt-1">Bem-vindo ao painel da Pet Clinica. Aqui você gerencia prontuários e agendamentos em tempo real.</p>
        </div>
        
        <button
          onClick={requestNotificationPermission}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            notificationsEnabled 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
          }`}
          id="btn-push-notifications"
        >
          <Bell className={`w-4 h-4 ${notificationsEnabled ? '' : 'animate-bounce'}`} />
          {notificationsEnabled ? 'Notificações Push Ativas' : 'Ativar Lembretes Push'}
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs hover:border-slate-200 transition-all">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Pacientes</p>
            <p className="text-2xl font-bold text-slate-800 font-display mt-0.5">{totalPets}</p>
            <p className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-blue-600">{dogsCount}</span> cães • <span className="font-semibold text-pink-500">{catsCount}</span> gatos
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs hover:border-slate-200 transition-all">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hoje na Clínica</p>
            <p className="text-2xl font-bold text-slate-800 font-display mt-0.5">{todayAppointments.length}</p>
            <p className="text-xs text-slate-500 mt-1">Consultas agendadas para hoje</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs hover:border-slate-200 transition-all">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Syringe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vacinas Pendentes</p>
            <p className="text-2xl font-bold text-slate-800 font-display mt-0.5">{vaccineAlerts.length}</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Requer atenção em breve</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs hover:border-slate-200 transition-all">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faturas Pendentes</p>
            <p className="text-2xl font-bold text-slate-800 font-display mt-0.5">{pendingPaymentsCount}</p>
            <p className="text-xs text-rose-600 font-medium mt-1">Aguardando pagamento Pix/Card</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lembretes Automáticos de Retornos e Vacinas */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600 animate-swing" />
                Lembretes Automáticos de Vacinas & Retornos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Alertas inteligentes de vacinas e retornos periódicos.</p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              {vaccineAlerts.length} alertas
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {vaccineAlerts.length > 0 ? (
              vaccineAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-3">
                    <img 
                      src={alert.avatar} 
                      alt={alert.petName} 
                      className="w-11 h-11 rounded-full object-cover border-2 border-white ring-2 ring-indigo-50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-800">{alert.petName}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${
                          alert.petType === 'dog' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                        }`}>
                          {alert.petType === 'dog' ? 'Cão' : 'Gato'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">Vacina: <span className="font-semibold text-slate-800">{alert.vaccineName}</span></p>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1 text-[11px] bg-amber-55 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
                      <AlertCircle className="w-3 h-3" />
                      Próxima dose: {alert.dueDate}
                    </div>
                    <button
                      onClick={() => {
                        onSelectPet(alert.petId);
                        onTabChange('patients');
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5 group"
                    >
                      Ver Carteira 
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
                <p className="font-semibold text-slate-700">Tudo em dia!</p>
                <p className="text-xs max-w-xs mt-1">Todos os seus pets cadastrados estão com a carteira de vacinação de reforço em dia.</p>
              </div>
            )}
          </div>

          <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60 flex items-start gap-2.5">
            <span className="text-xs">📢</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Como funcionam os retornos?</strong> Nosso sistema envia uma notificação push automatizada para o tutor 7 dias antes do vencimento da dose de reforço, possibilitando o agendamento de retorno em 1-clique.
            </p>
          </div>
        </div>

        {/* Consultas Hoje */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Consultas de Hoje
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              {todayAppointments.length} hoje
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((app) => (
                <div key={app.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:border-indigo-100 transition-all flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{app.petName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold text-white ${
                        app.type === 'vaccination' ? 'bg-sky-500' : app.type === 'checkup' ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`}>
                        {app.type === 'vaccination' ? 'Vacina' : app.type === 'checkup' ? 'Checkup' : 'Consulta'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{app.timeSlot}</span>
                      <span>•</span>
                      <span>Valor: R$ {app.cost}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold ${
                      app.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-55 text-rose-700 bg-rose-50'
                    }`}>
                      {app.paymentStatus === 'paid' ? 'Pago' : 'A pagar'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center">
                <Calendar className="w-10 h-10 mb-2 stroke-1" />
                <p className="font-semibold text-slate-600">Nenhum agendamento hoje</p>
                <p className="text-xs max-w-xs mt-1">Aproveite para organizar os prontuários ou tirar dúvidas no chat interno!</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => onTabChange('scheduling')}
            className="w-full bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs py-2.5 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1"
          >
            Fazer Novo Agendamento Online
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Internal Promo / Vet Consultation Info */}
      <div className="bg-radial from-indigo-50 to-indigo-100/30 p-6 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold font-display text-indigo-900 flex items-center justify-center md:justify-start gap-1.5">
            Dúvidas sobre o tratamento ou vacinas?
          </h3>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Consulte agora mesmo nosso chat inteligente integrado. O Dr. Silva está online 24h para orientar sobre sintomas, dosagens seguras de vermífugos, cuidados preventivos e cronogramas de vacinação de cães e gatos.
          </p>
        </div>
        <button
          onClick={() => onTabChange('chat')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
        >
          <MessageSquare className="w-4 h-4" />
          Falar com o Vet
        </button>
      </div>

    </div>
  );
}
