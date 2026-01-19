
import React from 'react';
import { User, Crown, Settings, LogOut, X, ShieldCheck, Heart, HelpCircle, Sparkles, ShoppingBag } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen, onClose }) => {
  const items = [
    { id: Page.Home, label: 'Accueil', icon: Sparkles },
    { id: Page.Market, label: 'Marché', icon: ShoppingBag },
    { id: Page.Profile, label: 'Mon Profil', icon: User },
    { id: Page.Cercle, label: 'Le Cercle', icon: Crown },
    { id: Page.Orders, label: 'Commandes', icon: ShieldCheck },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[90]" onClick={onClose} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-72 bg-white flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
              <Sparkles size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Visela</span>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
              <img src="https://picsum.photos/100/100?random=88" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Alexandre Durand</p>
              <p className="text-[10px] text-gray-400 font-medium mt-1">ID: VSL-8421-A</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id as Page); onClose(); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activePage === item.id ? 'bg-amber-50 text-amber-600 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm">
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
