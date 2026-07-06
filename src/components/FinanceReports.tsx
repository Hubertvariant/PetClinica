import React, { useState } from 'react';
import { Pet, Appointment } from '../types';
import { DollarSign, FileText, Download, TrendingUp, Syringe, Check, RefreshCw, Layers, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

interface FinanceReportsProps {
  pets: Pet[];
  appointments: Array<Appointment>;
}

export default function FinanceReports({ pets, appointments }: FinanceReportsProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMonth, setExportMonth] = useState('07/2026');

  // Calculations for Finance & Reports
  const paidAppointments = appointments.filter(app => app.paymentStatus === 'paid' && app.status !== 'cancelled');
  const totalRevenue = paidAppointments.reduce((sum, app) => sum + app.cost, 0);
  
  // Method Breakdowns
  const pixRevenue = paidAppointments.filter(app => app.paymentMethod === 'pix').reduce((sum, app) => sum + app.cost, 0);
  const cardRevenue = paidAppointments.filter(app => app.paymentMethod === 'credit').reduce((sum, app) => sum + app.cost, 0);

  // Patient Breakdowns
  const totalPets = pets.length;
  const dogsCount = pets.filter(p => p.type === 'dog').length;
  const catsCount = pets.filter(p => p.type === 'cat').length;
  const dogPct = totalPets > 0 ? Math.round((dogsCount / totalPets) * 100) : 0;
  const catPct = totalPets > 0 ? Math.round((catsCount / totalPets) * 100) : 0;

  // Vaccine Coverage: percentage of completed vaccines over total records
  const allVaccines = pets.flatMap(p => p.vaccinationHistory);
  const totalVaccinesCount = allVaccines.length;
  const completedVaccinesCount = allVaccines.filter(v => v.status === 'completed').length;
  const vaccineCoveragePct = totalVaccinesCount > 0 ? Math.round((completedVaccinesCount / totalVaccinesCount) * 100) : 0;

  // Categories Breakdown
  const categoriesRevenue = {
    consultation: paidAppointments.filter(app => app.type === 'consultation').reduce((sum, app) => sum + app.cost, 0),
    vaccination: paidAppointments.filter(app => app.type === 'vaccination').reduce((sum, app) => sum + app.cost, 0),
    checkup: paidAppointments.filter(app => app.type === 'checkup').reduce((sum, app) => sum + app.cost, 0),
    emergency: paidAppointments.filter(app => app.type === 'emergency').reduce((sum, app) => sum + app.cost, 0),
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  return (
    <div className="space-y-6" id="finance-reports-view">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-1.5">
            <DollarSign className="w-5 h-5 text-emerald-600 animate-swing" />
            Gestão Financeira & Relatórios Mensais
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gerencie transações, faturamento, indicadores clínicos de imunização e exporte planilhas analíticas.</p>
        </div>

        <button
          onClick={handleExport}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exportar Relatório Mensal ({exportMonth})
        </button>
      </div>

      {/* Numerical Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento Confirmado</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Sincronizado</span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-3xl font-extrabold text-slate-800 font-mono">R$ {totalRevenue}</p>
            <p className="text-[10px] text-slate-500 font-medium">Faturamento real liquidado de consultas/vacinas.</p>
          </div>
        </div>

        {/* PIX Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receita via Pix</span>
            <span className="text-[10px] font-mono text-indigo-600 font-bold">PIX Ativo</span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-bold text-slate-800 font-mono">R$ {pixRevenue}</p>
            <p className="text-[10px] text-slate-500 font-medium">({paidAppointments.filter(a => a.paymentMethod === 'pix').length} transações confirmadas)</p>
          </div>
        </div>

        {/* Credit Card Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receita via Cartão</span>
            <span className="text-[10px] font-mono text-indigo-600 font-bold">Gateway On</span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-bold text-slate-800 font-mono">R$ {cardRevenue}</p>
            <p className="text-[10px] text-slate-500 font-medium">({paidAppointments.filter(a => a.paymentMethod === 'credit').length} faturas liquidadas)</p>
          </div>
        </div>

        {/* Vaccine Coverage indicator */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taxa de Imunização</span>
            <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Meta: 80%</span>
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-slate-800">{vaccineCoveragePct}%</p>
              <span className="text-[10px] text-slate-400 font-semibold">{completedVaccinesCount}/{totalVaccinesCount} aplicadas</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${vaccineCoveragePct}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Analytical Charts and Diagrams Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Patient and Category Breakdowns (Visual Cards) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Faturamento por Categoria</h3>
          
          <div className="space-y-3.5">
            {/* Consultation */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Consultas Veterinárias</span>
                <span className="font-mono">R$ {categoriesRevenue.consultation}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalRevenue > 0 ? (categoriesRevenue.consultation / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Vaccination */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Doses e Vacinação</span>
                <span className="font-mono">R$ {categoriesRevenue.vaccination}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: `${totalRevenue > 0 ? (categoriesRevenue.vaccination / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Checkup */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Check-ups Preventivos</span>
                <span className="font-mono">R$ {categoriesRevenue.checkup}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${totalRevenue > 0 ? (categoriesRevenue.checkup / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Emergency */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Plantões de Emergência</span>
                <span className="font-mono">R$ {categoriesRevenue.emergency}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${totalRevenue > 0 ? (categoriesRevenue.emergency / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Species ratio distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Proporção de Pacientes Atendidos</h3>
            <p className="text-xs text-slate-400">Distribuição entre cães e gatos na base cadastral de prontuários.</p>
          </div>

          <div className="flex items-center gap-6 py-2 justify-center">
            {/* Dog column */}
            <div className="text-center space-y-1">
              <span className="text-3xl">🐶</span>
              <p className="font-bold text-lg text-blue-600">{dogPct}%</p>
              <p className="text-[10px] text-slate-500 font-semibold">{dogsCount} cães</p>
            </div>
            
            {/* Visual ratio bar */}
            <div className="flex-1 bg-slate-100 h-5 rounded-full overflow-hidden flex shadow-inner">
              <div className="bg-blue-500 h-full flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${dogPct}%` }}>
                {dogPct > 15 ? `${dogPct}%` : ''}
              </div>
              <div className="bg-pink-500 h-full flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${catPct}%` }}>
                {catPct > 15 ? `${catPct}%` : ''}
              </div>
            </div>

            {/* Cat column */}
            <div className="text-center space-y-1">
              <span className="text-3xl">🐱</span>
              <p className="font-bold text-lg text-pink-600">{catPct}%</p>
              <p className="text-[10px] text-slate-500 font-semibold">{catsCount} gatos</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex items-start gap-2.5">
            <span className="text-xs">📢</span>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              <strong>Insights de Gestão:</strong> A proporção de cães é {dogPct > catPct ? 'superior' : 'inferior'} a de felinos. Recomenda-se focar ações promocionais de vacinação felina (Tríplice/Quádrupla) para aumentar o ticket médio.
            </p>
          </div>
        </div>

      </div>

      {/* Ledger and Transactions Record list */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-750 uppercase tracking-wider">Histórico de Faturamento Liquidado</h3>
          <p className="text-xs text-slate-400 mt-0.5">Livro-caixa contendo as últimas transações faturadas e aprovadas no aplicativo.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-150 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3 font-semibold">Transação ID</th>
                <th className="pb-3 font-semibold">Paciente</th>
                <th className="pb-3 font-semibold">Data / Hora</th>
                <th className="pb-3 font-semibold">Procedimento</th>
                <th className="pb-3 font-semibold">Forma Pgto</th>
                <th className="pb-3 text-right font-semibold">Valor</th>
                <th className="pb-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paidAppointments.map((app) => (
                <tr key={app.id} className="text-slate-650 hover:bg-slate-50/50 transition-all">
                  <td className="py-3 font-mono font-bold text-slate-800">{app.transactionId || 'TX-SIMULATED'}</td>
                  <td className="py-3 font-bold text-slate-700 flex items-center gap-1.5">
                    <span>{app.petType === 'dog' ? '🐶' : '🐱'}</span>
                    {app.petName}
                  </td>
                  <td className="py-3">{new Date(app.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {app.timeSlot}</td>
                  <td className="py-3 font-medium text-slate-500">{app.type === 'vaccination' ? 'Vacina' : app.type === 'checkup' ? 'Check-up' : app.type === 'emergency' ? 'Emergência' : 'Consulta'}</td>
                  <td className="py-3 uppercase font-semibold text-indigo-600">{app.paymentMethod}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-800">R$ {app.cost}</td>
                  <td className="py-3 text-center">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Confirmado</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Exporting Print View Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-2xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>

            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold font-display text-slate-900">PET CLINICA LTDA</h1>
                <p className="text-xs text-slate-500">Relatório Analítico de Atividades Clínicas e Financeiras</p>
                <p className="text-[10px] text-slate-400">Período de Referência: {exportMonth} • Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded uppercase tracking-wider font-mono">
                EXPORT-APPROVED
              </span>
            </div>

            {/* Data Tables block */}
            <div className="space-y-4 text-xs leading-relaxed">
              
              {/* Table 1: Financial Performance */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>📊</span> 1. Desempenho Faturamento Mensal
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Liquido</p>
                    <p className="font-bold text-base text-slate-800 font-mono">R$ {totalRevenue}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Via PIX</p>
                    <p className="font-bold text-base text-slate-800 font-mono">R$ {pixRevenue}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Via Cartão</p>
                    <p className="font-bold text-base text-slate-800 font-mono">R$ {cardRevenue}</p>
                  </div>
                </div>
              </div>

              {/* Table 2: Clinical indicators */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>🧬</span> 2. Indicadores Clínicos & Imunológicos
                </h4>
                <table className="w-full border text-left rounded-lg overflow-hidden border-slate-200">
                  <thead className="bg-slate-50 font-bold uppercase text-[9px] text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Indicador Veterinário</th>
                      <th className="p-2 text-center">Base Alvo</th>
                      <th className="p-2 text-right">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 font-medium">Cobertura Imunológica (Doses Completas)</td>
                      <td className="p-2 text-center">{totalVaccinesCount} vacinas recomendadas</td>
                      <td className="p-2 text-right font-bold text-indigo-600">{vaccineCoveragePct}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Ratio Pacientes de Caninos (Cães)</td>
                      <td className="p-2 text-center">{totalPets} pets admitidos</td>
                      <td className="p-2 text-right font-bold text-blue-600">{dogPct}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Ratio Pacientes de Felinos (Gatos)</td>
                      <td className="p-2 text-center">{totalPets} pets admitidos</td>
                      <td className="p-2 text-right font-bold text-pink-600">{catPct}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table 3: Procedures billing */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>💼</span> 3. Receita por Linha de Atendimento
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div className="p-2 border rounded-lg text-center bg-slate-50">
                    <p className="text-[9px] text-slate-400 font-sans uppercase font-bold">Consultas</p>
                    <p className="font-bold text-slate-800 mt-1">R$ {categoriesRevenue.consultation}</p>
                  </div>
                  <div className="p-2 border rounded-lg text-center bg-slate-50">
                    <p className="text-[9px] text-slate-400 font-sans uppercase font-bold">Vacinas</p>
                    <p className="font-bold text-slate-800 mt-1">R$ {categoriesRevenue.vaccination}</p>
                  </div>
                  <div className="p-2 border rounded-lg text-center bg-slate-50">
                    <p className="text-[9px] text-slate-400 font-sans uppercase font-bold">Checkup</p>
                    <p className="font-bold text-slate-800 mt-1">R$ {categoriesRevenue.checkup}</p>
                  </div>
                  <div className="p-2 border rounded-lg text-center bg-slate-50">
                    <p className="text-[9px] text-slate-400 font-sans uppercase font-bold">Emergências</p>
                    <p className="font-bold text-slate-800 mt-1">R$ {categoriesRevenue.emergency}</p>
                  </div>
                </div>
              </div>

              {/* Auditor notes */}
              <div className="space-y-1">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">📝 Observações Fiscais & Médicas</p>
                <p className="text-[11px] text-slate-650 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic leading-relaxed">
                  "O presente relatório atesta o faturamento liquidado na Pet Clinica durante o ciclo {exportMonth}. O índice de imunização de cães e gatos de {vaccineCoveragePct}% encontra-se dentro das normas epidemiológicas recomendadas. Recomendamos manter a campanha ativa de vacinas antivirais via notificações automáticas para diminuir faltas de retorno."
                </p>
              </div>

            </div>

            {/* Print trigger and close buttons */}
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold"
              >
                Fechar Visualização
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Importar para PDF / Imprimir
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
