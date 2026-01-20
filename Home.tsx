
import React, { useState } from 'react';
import { Search, ChevronRight, Apple, Beef, Coffee, Fish, Leaf, Sparkles, BrainCircuit, Loader2, Volume2, Utensils } from 'lucide-react';
import { Page } from '../types';
import { getGeminiRecommendations, getChefTipAudio } from '../services/geminiService';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [chefTip, setChefTip] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const askAi = async (mood: string) => {
    setAiLoading(true);
    const recs = await getGeminiRecommendations(mood);
    setAiSuggestions(recs);
    setAiLoading(false);
  };

  const listenChef = async () => {
    setIsSpeaking(true);
    const tip = await getChefTipAudio("Produits Frais");
    setChefTip(tip);
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  const categories = [
    { name: 'Fruits', icon: Apple, color: 'bg-red-50 text-red-600' },
    { name: 'Légumes', icon: Leaf, color: 'bg-green-50 text-green-600' },
    { name: 'Viandes', icon: Beef, color: 'bg-orange-50 text-orange-600' },
    { name: 'Poissons', icon: Fish, color: 'bg-blue-50 text-blue-600' },
    { name: 'Epicerie', icon: Coffee, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-slide-up pb-32">
      
      {/* Hero Section */}
      <section className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic group-hover:tracking-normal transition-all duration-500">Expérience Visela</h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Le luxe de la fraîcheur à votre porte</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Que recherchez-vous aujourd'hui ?" 
              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 text-white text-sm focus:bg-white/10 outline-none transition-all font-bold"
            />
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </section>

      {/* Le Chef Visela - TTS Feature */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Utensils size={28} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight">Le Chef Visela</h2>
              <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Conseil du jour en temps réel</p>
            </div>
          </div>
          <button 
            onClick={listenChef}
            disabled={isSpeaking}
            className={`p-4 rounded-xl transition-all ${isSpeaking ? 'bg-amber-500 text-black scale-95' : 'bg-gray-50 text-gray-400 hover:bg-amber-50'}`}
          >
            {isSpeaking ? <Loader2 className="animate-spin" size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        
        {chefTip && (
          <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 animate-in fade-in slide-in-from-left-4">
            <p className="text-[10px] font-bold text-amber-900 italic">"{chefTip}"</p>
          </div>
        )}
      </section>

      {/* Assistant Mood IA */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 text-amber-500 rounded-lg flex items-center justify-center">
            <BrainCircuit size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-tight">Shopping Intelligent</h2>
        </div>
        
        <p className="text-[9px] font-bold text-gray-400 uppercase">Comment se passe votre journée ?</p>
        
        <div className="flex flex-wrap gap-2">
          {['Fatigué', 'Sportif', 'Gourmand', 'Zéro Déchet'].map(mood => (
            <button 
              key={mood}
              onClick={() => askAi(mood)}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
            >
              {mood}
            </button>
          ))}
        </div>

        {aiLoading && (
          <div className="flex items-center gap-2 py-2 text-amber-600">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest">Calcul du panier idéal...</span>
          </div>
        )}

        {aiSuggestions.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[8px] font-black text-gray-400 uppercase mb-2 tracking-widest">Gemini suggère :</p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map(s => (
                <button key={s} onClick={() => onNavigate(Page.Market)} className="bg-white px-3 py-1.5 rounded-lg text-[9px] font-bold shadow-sm border border-gray-200 hover:border-amber-500 transition-colors">{s}</button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Rayons Rapides */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black uppercase tracking-tighter">Nos Rayons</h2>
          <ChevronRight size={16} className="text-gray-300" />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {categories.map((cat, i) => (
            <button key={i} onClick={() => onNavigate(Page.Market)} className="flex flex-col items-center gap-2 group">
              <div className={`w-full aspect-square ${cat.color} rounded-[1.5rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-white/50`}>
                <cat.icon size={22} />
              </div>
              <span className="text-[8px] font-black text-gray-400 uppercase text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
