
import React from 'react';
// Added Wallet to imports
import { Crown, Sparkles, Zap, ShieldCheck, ShoppingBag, Truck, Gift, ChevronRight, Wallet } from 'lucide-react';
import { Page } from '../types';

interface CercleProps {
  totalSpent: number;
  onNavigate: (page: Page) => void;
}

const Cercle: React.FC<CercleProps> = ({ totalSpent, onNavigate }) => {
  const threshold = 350000;
  const progress = Math.min(100, (totalSpent / threshold) * 100);
  const isCercle = totalSpent >= threshold;

  const benefits = [
    { icon: Truck, title: 'Livraison Gratuite', desc: '0 F CFA sur toutes vos commandes, à vie.' },
    { icon: Wallet, title: 'Wallet Privé', desc: 'Activez votre carte rechargeable pour payer sans friction.' },
    { icon: Sparkles, title: 'Produits Exclusifs', desc: 'Accès au rayon Épicerie Fine et produits rares.' },
    { icon: Gift, title: 'Avant-Premières', desc: 'Recevez les nouveaux arrivages 24h avant tout le monde.' }
  ];

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-40 animate-in fade-in duration-700">
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-500 text-black rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/20">
          <Crown size={14} /> Membre Privilégié
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none">
          Le <span className="text-amber-500 italic font-serif">Cercle</span>
        </h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">L'accès n'est pas à vendre, il se mérite.</p>
      </div>

      {/* Jauge de Progression */}
      <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Progression d'achats</p>
                <h3 className="text-2xl font-black tracking-tighter">{new Intl.NumberFormat('fr-FR').format(totalSpent)} F / {new Intl.NumberFormat('fr-FR').format(threshold)} F</h3>
              </div>
              <span className="text-3xl font-black text-amber-500 tracking-tighter">{Math.floor(progress)}%</span>
            </div>
            
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000 shadow-lg shadow-amber-500/30" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-[10px] font-bold text-gray-500 italic">
              {isCercle 
                ? "Félicitations ! Vous êtes désormais un membre éminent du Cercle Visela." 
                : `Dépensez encore ${new Intl.NumberFormat('fr-FR').format(threshold - totalSpent)} F pour débloquer vos privilèges à vie.`}
            </p>
          </div>

          <div className="shrink-0 w-40 h-40 bg-gray-900 rounded-[3rem] flex items-center justify-center relative shadow-2xl group cursor-pointer" onClick={() => onNavigate(Page.Market)}>
            <div className="absolute inset-0 bg-amber-500/20 rounded-[3rem] blur-xl group-hover:blur-2xl transition-all"></div>
            <ShoppingBag size={48} className="text-amber-500 relative z-10" />
            <div className="absolute -bottom-2 bg-amber-500 text-black px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Acheter</div>
          </div>
        </div>
      </div>

      {/* Liste des Avantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-4 hover:shadow-xl transition-all ${isCercle ? 'opacity-100' : 'opacity-60'}`}>
            <div className="w-12 h-12 bg-gray-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
              <b.icon size={22} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">{b.title}</h4>
              <p className="text-[9px] font-medium text-gray-400 mt-2 leading-relaxed uppercase">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8 border-t border-gray-100">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center justify-center gap-3">
          <ShieldCheck size={14} /> Protocole Visela Security • Inscription automatique
        </p>
      </div>
    </div>
  );
};

export default Cercle;
