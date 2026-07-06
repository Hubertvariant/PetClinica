import React, { useState } from 'react';
import { Feedback } from '../types';
import { Star, Plus, ThumbsUp, Check, AlertCircle, MessageSquare } from 'lucide-react';

interface FeedbackProps {
  feedbacks: Feedback[];
  onAddFeedback: (feedback: Partial<Feedback>) => Promise<any>;
}

export default function FeedbackView({ feedbacks, onAddFeedback }: FeedbackProps) {
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !petName || !text) {
      alert("Por favor, preencha todos os campos do feedback.");
      return;
    }

    try {
      await onAddFeedback({
        author,
        petName,
        petType,
        rating,
        text
      });

      setAuthor('');
      setPetName('');
      setText('');
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations for average stars
  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  const fiveStarPct = feedbacks.length > 0
    ? Math.round((feedbacks.filter(f => f.rating === 5).length / feedbacks.length) * 100)
    : 0;

  const fourStarPct = feedbacks.length > 0
    ? Math.round((feedbacks.filter(f => f.rating === 4).length / feedbacks.length) * 100)
    : 0;

  return (
    <div className="space-y-6" id="feedback-view">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-1.5">
            <ThumbsUp className="w-5 h-5 text-amber-500 animate-swing" />
            Depoimentos & Opiniões de Clientes
          </h2>
          <p className="text-xs text-slate-500 mt-1">Veja a avaliação da nossa clínica pelos tutores e registre seu próprio depoimento real.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Fechar Depoimento' : 'Registrar Minha Opinião'}
        </button>
      </div>

      {/* Grid: Stat aggregates & feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Statistics Aggregations */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Aprovação da Clínica</h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-800 font-display">{averageRating}</span>
            <div className="flex flex-col">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(parseFloat(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-xs text-slate-400 mt-0.5">Baseado em {feedbacks.length} avaliações</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* 5 stars */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Excelente (5 estrelas)</span>
                <span>{fiveStarPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${fiveStarPct}%` }} />
              </div>
            </div>

            {/* 4 stars */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Ótimo (4 estrelas)</span>
                <span>{fourStarPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-300 h-full rounded-full" style={{ width: `${fourStarPct}%` }} />
              </div>
            </div>

            {/* 3 stars or lower */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Regular ou inferior</span>
                <span>{100 - fiveStarPct - fourStarPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: `${100 - fiveStarPct - fourStarPct}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-amber-50/55 p-3.5 rounded-xl border border-amber-100 flex items-start gap-2">
            <span className="text-xs">🩺</span>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              A Pet Clinica preza pela máxima qualidade médica e bem-estar de cães e gatos. Todas as avaliações são verificadas de forma fidedigna.
            </p>
          </div>
        </div>

        {/* Central Feed / Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Form: Add Testimonial */}
          {showForm && (
            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-md space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-indigo-600" />
                  Registrar Minha Opinião Clínica
                </h3>
                <p className="text-[11px] text-slate-500">Conte-nos sobre sua experiência prática de atendimento e cuidados na Pet Clinica.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Seu Nome Completo</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 text-slate-700 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome do seu Pet</label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Ex: Pipoca"
                      className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 text-slate-700 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Espécie do Pet</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPetType('dog')}
                        className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                          petType === 'dog'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-slate-100 bg-slate-50 text-slate-650'
                        }`}
                      >
                        🐶 Cão / Cachorro
                      </button>
                      <button
                        type="button"
                        onClick={() => setPetType('cat')}
                        className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                          petType === 'cat'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-slate-100 bg-slate-50 text-slate-650'
                        }`}
                      >
                        🐱 Gato / Gatinho
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Sua Nota (1 a 5 estrelas)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-115 transition-all text-amber-400"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Seu Depoimento</label>
                  <textarea
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Fale sobre a qualidade das consultas, vacinas e o atendimento dos veterinários..."
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 text-slate-700"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Publicar Depoimento de Avaliação
                </button>
              </form>
            </div>
          )}

          {/* Testimonials Feed */}
          <div className="space-y-4">
            {feedbacks.length > 0 ? (
              feedbacks.map(f => (
                <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img 
                        src={f.avatar} 
                        alt={f.author} 
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100';
                        }}
                      />
                      <div>
                        <p className="font-bold text-sm text-slate-800">{f.author}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Tutor(a) de <span className="font-bold text-slate-500">{f.petName}</span> ({f.petType === 'dog' ? 'Cão' : 'Gato'}) • {new Date(f.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{f.text}"
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white border rounded-2xl text-slate-400 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600">Nenhum depoimento encontrado</p>
                <p className="text-xs mt-1">Seja o primeiro tutor a registrar uma opinião de carinho sobre a Pet Clinica!</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
