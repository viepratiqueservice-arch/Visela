
import React from 'react';
import { Menu, ChevronRight, Crown, Fingerprint, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    onMenuClick: () => void;
    activePage: Page;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activePage }) => {
  const getPageTitle = (page: Page) => {
    switch (page) {
      case Page.Home: return 'Accueil';
      case Page.Market: return 'Le Marché';
      case Page.Cart: return 'Mon Panier';
      case Page.Orders: return 'Mes Colis';
      case Page.Profile: return 'Mon Profil';
      case Page.Cercle: return 'Le Cercle';
      default: return 'Visela';
    }
  };

  const CLIENT_ID = "VSL-8421-A";

  return (
    <div className="flex flex-col w-full sticky top-0 z-[60]">
      {/* Barre Principale Profil */}
      <div className="bg-[#0D0D0D] px-4 py-4 flex items-center justify-between shadow-2xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-amber-500 border border-white/10">
            <Fingerprint size={20} />
          </div>
          <div>
            <h2 className="text-white text-xs font-black uppercase tracking-tight leading-none">Alexandre Durand</h2>
            <p className="text-amber-500 text-[7px] font-black uppercase tracking-widest mt-1">Visela ID: {CLIENT_ID}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => onNavigate(Page.Cercle)}
             className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
               activePage === Page.Cercle 
               ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
               : 'bg-white/5 text-amber-500 hover:bg-white/10'
             }`}
           >
             <Sparkles size={12} /> Cercle
           </button>
           <div 
             className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden" 
             onClick={() => onNavigate(Page.Profile)}
           >
             <img src="https://picsum.photos/100/100?random=88" className="w-full h-full object-cover" alt="Profile" />
           </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white px-6 py-3 border-b border-gray-100 flex items-center gap-2 shadow-sm">
         <div className="w-2.5 h-2.5 bg-gray-900 rounded-[2px]"></div>
         <ChevronRight size={10} className="text-gray-300" />
         <span className="text-[9px] font-black text-gray-900 uppercase tracking-[0.2em]">
            {getPageTitle(activePage)}
         </span>
      </div>
    </div>
  );
};

export default Header;
