
import React from 'react';
import { Search, ChevronRight, Apple, Beef, Coffee, Fish, Leaf, Sparkles, Clock, MapPin, TrendingUp, Crown } from 'lucide-react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const categories = [
    { name: 'Fruits', icon: Apple, color: 'bg-red-50 text-red-600' },
    { name: 'Légumes', icon: Leaf, color: 'bg-green-50 text-green-600' },
    { name: 'Viandes', icon: Beef, color: 'bg-orange-50 text-orange-600' },
    { name: 'Poissons', icon: Fish, color: 'bg-blue-50 text-blue-600' },
    { name: 'Epicerie', icon: Coffee, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-slide-up">
      
      {/* Header Search Dashboard */}
      <section className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Bonjour, Franck !</h1>
            <p className="text-emerald-100 text-sm font-medium">Prêt pour votre marché de la semaine ?</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un produit frais..." 
              className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-gray-900 text-sm focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-[-15deg] translate-x-12"></div>
      </section>

      {/* Catégories Grille */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Nos Rayons</h2>
          <button onClick={() => onNavigate(Page.Market)} className="text-xs font-bold text-emerald-600">Voir tout</button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => onNavigate(Page.Market)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-full aspect-square ${cat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm group-active:scale-95`}>
                <cat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Section Statut / Quick Actions - MISE À JOUR CERCLE */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3 group cursor-pointer" onClick={() => onNavigate(Page.Orders)}>
          <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Suivi Colis</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Vérifier l'état de livraison</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3 group cursor-pointer" onClick={() => onNavigate(Page.Cercle)}>
          <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
            <Crown size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Le Cercle</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Gérer vos privilèges à vie</p>
          </div>
        </div>
      </div>

      {/* Recommendation visuelle simple */}
      <section className="bg-white rounded-[2rem] border border-gray-100 p-6 flex items-center gap-6 shadow-sm">
        <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">Le choix du jour</span>
          <h3 className="text-base font-bold text-gray-900 leading-tight">Panier Fraîcheur Hebdo : Fruits & Agrumes</h3>
          <button 
            onClick={() => onNavigate(Page.Market)}
            className="flex items-center gap-2 text-emerald-600 font-bold text-xs"
          >
            Découvrir maintenant <ChevronRight size={14} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;
