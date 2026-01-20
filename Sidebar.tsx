import React from 'react';
import { User, Crown, LogOut, X, ShoppingBag, ShoppingCart, Package, Sparkles, Home, Shield } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  clientId: string;
  // Added missing onLogout prop
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen, onClose, userName, clientId, onLogout }) => {
  const items = [
    { id: Page.Home, label: 'Accueil', icon: Home, desc: 'Rayons & Suggestions' },
    { id: Page.Market, label: 'Marché', icon: ShoppingBag, desc: 'Produits Frais' },
    { id: Page.Cart, label: 'Mon Panier', icon: ShoppingCart, desc: 'Expédition' },
    { id: Page.Orders, label: 'Mes Commandes', icon: Package, desc: 'Suivi de Colis' },
    { id: Page.Profile, label: 'Mon Profil', icon: User, desc: 'Wallet & Adresses' },
    { id: Page.Cercle, label: 'Le Cercle', icon: Crown, desc: 'Privilèges VIP' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[90] transition-opacity duration-500" onClick={onClose} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-80 bg-white flex flex-col h-full shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">Visela</span>
              <p className="text-[7px] font-black text-amber-600 uppercase tracking-[0.4em]">Protocol V.1</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-md border border-gray-100 p-1">
              <img src={`https://picsum.photos/100/100?seed=${clientId}`} className="w-full h-full object-cover rounded-xl" alt="User" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-black text-gray-900 leading-none truncate uppercase tracking-tighter">{userName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield size={10} className="text-emerald-500" />
                <p className="text-[9px] text-gray-400 font-bold truncate">Membre Vérifié</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id as Page); onClose(); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                activePage === item.id 
                ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/20' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={22} className={activePage === item.id ? 'text-black' : 'group-hover:text-amber-500'} />
              <div className="text-left">
                <span className="text-sm block">{item.label}</span>
                <span className={`text-[8px] uppercase tracking-widest font-bold ${activePage === item.id ? 'text-black/60' : 'text-gray-300'}`}>{item.desc}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <button onClick={() => { onLogout(); onClose(); }} className="flex items-center gap-3 px-6 py-4 w-full text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest">
            <LogOut size={18} />
            <span>Fermer Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;