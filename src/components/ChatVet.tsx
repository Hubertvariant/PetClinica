import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, Send, Trash2, HeartPulse, ShieldAlert, Sparkles, User } from 'lucide-react';

interface ChatVetProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<any>;
  onClearChat: () => Promise<any>;
}

export default function ChatVet({ messages, onSendMessage, onClearChat }: ChatVetProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive or isTyping changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || !inputText.trim() || isTyping) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      await onSendMessage(textToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6" id="chat-vet-view">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-1.5">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Canal Vet de Plantão (Dr. Silva)
          </h2>
          <p className="text-xs text-slate-500 mt-1">Esclareça dúvidas gerais de saúde, vacinas, sintomas e nutrição do seu cão ou gato com o Dr. Carlos Silva.</p>
        </div>

        <button
          onClick={() => {
            if (confirm("Deseja redefinir todo o histórico de conversas com o veterinário?")) {
              onClearChat();
            }
          }}
          className="text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-2 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Limpar Conversa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chat Console (Left Panel) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col h-[520px] overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 border border-indigo-400 overflow-hidden flex items-center justify-center font-bold text-sm">
                👨‍⚕️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm">Dr. Carlos Silva</span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  <span className="text-[10px] bg-indigo-500 px-1.5 py-0.2 rounded font-semibold text-indigo-100 uppercase tracking-wider">Online</span>
                </div>
                <p className="text-xs text-indigo-200">Veterinário Responsável CRMV/SP 8812</p>
              </div>
            </div>

            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map(msg => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}>
                  
                  {/* Avatar bubble */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-xs shrink-0 ${
                    isBot ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isBot ? '👨‍⚕️' : <User className="w-4 h-4" />}
                  </div>

                  {/* Body balloon */}
                  <div className={`space-y-1 p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isBot 
                      ? 'bg-white text-slate-750 border border-slate-100 shadow-xs rounded-tl-none' 
                      : 'bg-indigo-600 text-white shadow-xs rounded-tr-none'
                  }`}>
                    <p>{msg.text}</p>
                    <span className={`block text-[9px] text-right mt-1 font-semibold ${
                      isBot ? 'text-slate-400' : 'text-indigo-200'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>

                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold border shrink-0">
                  👨‍⚕️
                </div>
                <div className="bg-white text-slate-550 p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-xs flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Dr. Silva está elaborando a orientação</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Form Panel */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida sobre coceira, vacinas, doses de vermífugo, vômitos..."
              className="flex-1 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 text-slate-750"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              Enviar <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

        {/* Vet Safety Guidelines (Right Panel) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Guia de Emergência e Triagem
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Nosso chat inteligente é treinado clinicamente para tirar dúvidas de baixa complexidade sobre comportamento, alimentação, dosagens básicas e vacinas.
            </p>

            {/* Red Alert Emergency Symptoms */}
            <div className="p-3.5 rounded-xl bg-rose-55 bg-rose-50 border border-rose-100 space-y-2">
              <p className="text-xs font-bold text-rose-700 flex items-center gap-1">
                <HeartPulse className="w-4 h-4 animate-pulse" />
                Sintomas Críticos de Alerta:
              </p>
              <ul className="text-[11px] text-rose-800 list-disc list-inside space-y-1 font-medium leading-relaxed">
                <li>Convulsões ou tremores incontroláveis</li>
                <li>Dificuldade aguda para respirar (ofegante)</li>
                <li>Ingestão de veneno ou chocolate</li>
                <li>Sangramento abundante ou trauma físico</li>
                <li>Apatia profunda e recusa de água por 24h</li>
              </ul>
            </div>

            <p className="text-[11px] text-slate-450 italic leading-relaxed">
              ⚠️ Se o seu pet apresentar qualquer um desses sintomas severos, não espere a resposta do chat. Traga-o imediatamente para a Emergência 24h da Pet Clinica.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
            <p className="text-xs font-bold text-slate-700">Dica Prática do Vet:</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sempre mantenha a carteira de vacinação digital atualizada! A imunização é a única barreira contra doenças graves como Parvovirose e Raiva.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
