import React, { useState } from 'react';
import { PetGramPost } from '../types';
import { Heart, MessageSquare, Send, Plus, Image, Camera, Check, Tag } from 'lucide-react';

interface PetGramProps {
  posts: PetGramPost[];
  onLikePost: (postId: string) => Promise<any>;
  onCommentPost: (postId: string, author: string, text: string) => Promise<any>;
  onAddPost: (post: Partial<PetGramPost>) => Promise<any>;
}

export default function PetGram({ posts, onLikePost, onCommentPost, onAddPost }: PetGramProps) {
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<'dog' | 'cat'>('dog');
  const [newCaption, setNewCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState('Alta Médica');
  const [selectedImagePreset, setSelectedImagePreset] = useState(0);

  // Comment typing state map
  const [commentInputMap, setCommentInputMap] = useState<{[postId: string]: string}>({});

  const imagePresets = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600", // Beagle
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600", // Tabby cat
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600", // Golden Retriever
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600", // Cool Cat
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600", // Pug
    "https://images.unsplash.com/photo-1537151608828-ea2b117b6281?auto=format&fit=crop&q=80&w=600", // Dog puppy
  ];

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName || !newCaption) {
      alert("Por favor, preencha o nome do pet e a legenda da foto!");
      return;
    }

    try {
      await onAddPost({
        petName: newPetName,
        petType: newPetType,
        imageUrl: imagePresets[selectedImagePreset],
        caption: newCaption,
        tag: selectedTag
      });

      setNewPetName('');
      setNewCaption('');
      setShowAddPostForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostLike = async (postId: string) => {
    try {
      await onLikePost(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputMap[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      await onCommentPost(postId, 'Tutor', commentText);
      // Clear specific post's comment input
      setCommentInputMap(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" id="petgram-view">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-1.5">
            <Camera className="w-5 h-5 text-pink-500" />
            PetGram - Galeria de Pacientes
          </h2>
          <p className="text-xs text-slate-500 mt-1">Veja nossos queridos clientes atendidos e as fotos de momentos felizes na clínica.</p>
        </div>

        <button
          onClick={() => setShowAddPostForm(!showAddPostForm)}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showAddPostForm ? 'Fechar Publicação' : 'Publicar Foto de Paciente'}
        </button>
      </div>

      {/* Grid: Form to Add Post and Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Create Post Form */}
        {showAddPostForm && (
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-md space-y-4">
            <div className="border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Image className="w-4 h-4 text-pink-500" />
                Compartilhar Foto Feliz
              </h3>
              <p className="text-[11px] text-slate-500">Mostre a todos a felicidade e a recuperação do seu pet!</p>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome do Paciente</label>
                <input
                  type="text"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  placeholder="Ex: Totó e Amigos"
                  className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-500 text-slate-700 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Espécie</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPetType('dog')}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      newPetType === 'dog'
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-slate-100 bg-slate-50 text-slate-600'
                    }`}
                  >
                    🐶 Cão
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPetType('cat')}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      newPetType === 'cat'
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-slate-100 bg-slate-50 text-slate-600'
                    }`}
                  >
                    🐱 Gato
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Marcador / Tag</label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold"
                >
                  <option value="Alta Médica">Alta Médica 🎉</option>
                  <option value="Vacinação em Dia">Vacinação em Dia 💉</option>
                  <option value="Banho & Spa">Banho & Spa 🧼</option>
                  <option value="Consulta de Rotina">Consulta de Rotina 🩺</option>
                  <option value="Cirurgia Concluída">Cirurgia Concluída 🏥</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Escolha uma Foto do Paciente</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {imagePresets.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImagePreset(idx)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImagePreset === idx ? 'border-pink-500 scale-95 ring-2 ring-pink-100' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="preset" className="w-full h-12 object-cover" />
                      {selectedImagePreset === idx && (
                        <span className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white bg-pink-500 rounded-full p-0.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Legenda (Texto do Post)</label>
                <textarea
                  rows={3}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Conte-nos sobre a visita clínica..."
                  className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-500 text-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
              >
                Publicar no PetGram 🚀
              </button>
            </form>
          </div>
        )}

        {/* Right Side: Feed List */}
        <div className={`${showAddPostForm ? 'lg:col-span-8' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-2 gap-6 w-full`}>
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col group hover:border-pink-100 transition-all">
                
                {/* Photo Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5 shadow-sm">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xs font-bold text-pink-600 font-display">
                        {post.petName.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-slate-800">{post.petName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{post.petType === 'dog' ? '🐶 Cão' : '🐱 Gato'}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">{new Date(post.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  {post.tag && (
                    <span className="text-[9px] font-bold bg-pink-50 text-pink-600 border border-pink-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                      <Tag className="w-2.5 h-2.5" />
                      {post.tag}
                    </span>
                  )}
                </div>

                {/* Photo Display */}
                <div className="relative overflow-hidden aspect-video bg-slate-50">
                  <img 
                    src={post.imageUrl} 
                    alt={post.petName} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>

                {/* Photo Actions & Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Like & Comments Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePostLike(post.id)}
                        className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:scale-110 transition-all cursor-pointer"
                      >
                        <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                        <span>{post.likes}</span>
                      </button>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <MessageSquare className="w-5 h-5" />
                        <span>{post.comments ? post.comments.length : 0}</span>
                      </div>
                    </div>

                    {/* Caption */}
                    <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                      <strong className="text-slate-800 font-bold">{post.petName} </strong>
                      {post.caption}
                    </p>
                  </div>

                  {/* Comments Log */}
                  <div className="pt-2.5 border-t border-slate-100 space-y-2">
                    {post.comments && post.comments.length > 0 && (
                      <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                        {post.comments.map(c => (
                          <div key={c.id} className="text-[11px] text-slate-650 bg-slate-50 p-2 rounded-lg leading-relaxed">
                            <span className="font-bold text-slate-850">{c.author}: </span>
                            <span>{c.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Write Comment Form */}
                    <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex gap-2">
                      <input
                        type="text"
                        value={commentInputMap[post.id] || ''}
                        onChange={(e) => setCommentInputMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Adicione um comentário para o tutor..."
                        className="flex-1 bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] outline-none text-slate-700"
                      />
                      <button
                        type="submit"
                        className="bg-slate-100 hover:bg-pink-500 hover:text-white text-slate-600 px-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white border rounded-2xl text-slate-400 text-center">
              <Camera className="w-12 h-12 text-slate-300 mb-2 animate-bounce" />
              <p className="font-semibold text-slate-600">O feed está limpo!</p>
              <p className="text-xs mt-1">Clique no botão superior e publique a primeira foto feliz do seu pet.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
