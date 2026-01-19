
import React, { useState } from 'react';
import { ShoppingBag, Box, Activity, Edit3, Search, Users, Navigation, LayoutDashboard, Map, Bell, ArrowLeft, Wallet, CheckCircle, XCircle } from 'lucide-react';
import { Order, Page, FoodItem, ReloadRequest } from '../types';

interface AdminProps {
  orders: Order[];
  products: FoodItem[];
  setProducts: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  categories: string[];
  reloadRequests: ReloadRequest[];
  onApproveReload: (id: string) => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onNavigate: (page: Page) => void;
}

type AdminTab = 'dashboard' | 'orders' | 'recharges' | 'customers' | 'logistics';

const Admin: React.FC<AdminProps> = ({ 
  orders, products, setProducts, categories, reloadRequests, onApproveReload, onUpdateStatus, onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR').format(p) + ' F';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, badge: orders.filter(o => o.status !== 'Livré').length },
    { id: 'recharges', label: 'Recharges', icon: Wallet, badge: reloadRequests.filter(r => r.status === 'En attente').length },
    { id: 'customers', label: 'Clients CRM', icon: Users },
    { id: 'logistics', label: 'Tournées', icon: Map },
  ];

  return (
    <div className="flex h-screen bg-[#0F1115] text-white overflow-hidden text-sm">
      <aside className={`bg-[#161920] border-r border-white/5 flex flex-col shrink-0 transition-all duration-300 z-20 ${isSidebarCollapsed ? 'w-16' : 'w-56'}`}>
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg shadow-xl cursor-pointer" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            <span className="text-black text-lg font-serif font-bold">V</span>
          </div>
          {!isSidebarCollapsed && <h1 className="font-black text-xs uppercase tracking-tighter truncate">Visela Master</h1>}
        </div>
        <nav className="flex-1 p-2 space-y-1 mt-2">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as AdminTab)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg relative ${activeTab === item.id ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5'}`}>
              <item.icon size={18} />
              {!isSidebarCollapsed && <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>}
              {item.badge ? <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-black text-[8px] font-black rounded-full flex items-center justify-center">{item.badge}</span> : null}
            </button>
          ))}
        </nav>
        <button onClick={() => onNavigate(Page.Auth)} className="p-4 text-gray-500 hover:text-red-400 flex items-center gap-3 border-t border-white/5">
          <ArrowLeft size={18} />
          {!isSidebarCollapsed && <span className="text-[10px] uppercase font-bold">Quitter</span>}
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">{activeTab}</h2>
          <div className="p-3 bg-white/5 rounded-xl text-gray-400"><Bell size={20} /></div>
        </header>

        {activeTab === 'recharges' && (
          <div className="bg-[#161920] rounded-[3rem] border border-white/5 p-8 animate-in slide-in-from-bottom-4">
            <h3 className="text-lg font-black uppercase tracking-tighter mb-8 flex items-center gap-3"><Wallet className="text-amber-500" /> Validation Recharges</h3>
            <div className="space-y-4">
              {reloadRequests.map((req) => (
                <div key={req.id} className="bg-white/5 p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-amber-500/30 transition-all">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase">{req.userName}</p>
                    <p className="text-[8px] text-gray-500">ID: {req.userId} • {req.date}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-amber-500 tracking-tighter">{formatPrice(req.amount)}</p>
                    <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${req.status === 'Validé' ? 'bg-emerald-500 text-black' : 'bg-amber-500/20 text-amber-500'}`}>{req.status}</span>
                  </div>
                  <div className="flex gap-2">
                    {req.status === 'En attente' && (
                      <button 
                        onClick={() => onApproveReload(req.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-xl transition-all"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button className="bg-white/5 hover:bg-red-900/40 p-3 rounded-xl text-gray-400 hover:text-white transition-all">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {reloadRequests.length === 0 && <p className="text-center text-gray-600 uppercase text-[8px] tracking-widest py-10">Aucune demande active</p>}
            </div>
          </div>
        )}

        {/* Dashboard minimal */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#161920] p-8 rounded-[3rem] border border-white/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Volume Commandes</p>
              <h2 className="text-5xl font-black tracking-tighter">{orders.length} <span className="text-amber-500">Flux</span></h2>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
