
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Market from './pages/Market';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Cercle from './pages/Cercle';
import SecurityGate from './components/SecurityGate';
import { Menu as MenuIcon, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Page, FoodItem, CartItem, Order, ReloadRequest, User, Category, UserAddress } from './types';
import { supabase, db } from './services/supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Paramètres système dynamiques
  const [sysSettings, setSysSettings] = useState<Record<string, any>>({
    cercle_threshold: 350000,
    delivery_fee: 800,
    store_open: true,
    global_announcement: '',
    delivery_slots: ["Matin: 08h-12h", "Après-midi: 13h-17h"]
  });

  const [products, setProducts] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await db.settings.getAll();
      if (data) {
        const config: any = {};
        data.forEach(item => { config[item.key] = item.value; });
        setSysSettings(prev => ({ ...prev, ...config }));
      }
    };
    fetchConfig();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: prods } = await db.products.list();
      const { data: cats } = await supabase.from('categories').select('*');
      if (prods) setProducts(prods);
      if (cats) setCategories(cats);
    };
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      const savedPhone = localStorage.getItem('visela_phone');
      if (savedPhone) {
        const { data: profile } = await db.profiles.get(savedPhone);
        if (profile) {
          setCurrentUser(profile);
          setIsLoggedIn(true);
          const { data: ords } = await db.orders.list(profile.clientId);
          if (ords) setOrders(ords);
        }
      }
      setIsLoading(false);
    };
    initApp();
  }, []);

  const handleCheckout = async (addr: string, slot: string, method: string) => {
    if (!currentUser) return;
    
    const isCercle = currentUser.totalSpent >= sysSettings.cercle_threshold;
    const deliveryFee = isCercle ? 0 : Number(sysSettings.delivery_fee);
    const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const total = subtotal + deliveryFee;

    const newOrder: any = { 
      id: 'VSL-' + Math.floor(1000 + Math.random() * 9000), 
      date: new Date().toLocaleDateString('fr-FR'), 
      items: cart, 
      status: 'En préparation', 
      total: total, 
      deliveryAddress: addr, 
      deliverySlot: slot,
      paymentMethod: method,
      customerClientId: currentUser.clientId
    };

    const { error: orderError } = await db.orders.create(newOrder);
    if (!orderError) {
      for (const item of cart) {
        const prod = products.find(p => p.id === item.id);
        if (prod) await db.products.updateStock(item.id, prod.stock - item.quantity);
      }
      const newTotalSpent = (currentUser.totalSpent || 0) + total;
      const updates = {
        totalSpent: newTotalSpent,
        status: newTotalSpent >= sysSettings.cercle_threshold ? 'Cercle' : 'Standard',
        walletBalance: method === 'Wallet' ? (currentUser.walletBalance || 0) - total : (currentUser.walletBalance || 0)
      };
      await db.profiles.update(currentUser.id, updates);
      setCurrentUser({ ...currentUser, ...updates });
      setOrders([newOrder, ...orders]);
      setCart([]);
      setCurrentPage(Page.Orders);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] flex items-center justify-center animate-pulse shadow-2xl">
          <span className="text-black text-5xl font-serif font-bold">V</span>
        </div>
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.6em]">Visela Protocol Init</p>
      </div>
    );
  }

  if (!sysSettings.store_open && !currentUser?.name.toLowerCase().includes('admin')) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-10 text-center">
        <AlertCircle size={64} className="text-amber-500 mb-6" />
        <h1 className="text-2xl font-black uppercase tracking-tighter">Maintenance en cours</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-xs uppercase font-bold tracking-tight">Le magasin est fermé temporairement. Revenez plus tard !</p>
      </div>
    );
  }

  const renderPage = () => {
    if (!isLoggedIn) return <Auth onLogin={(u) => { setCurrentUser(u); setIsLoggedIn(true); localStorage.setItem('visela_phone', u.clientId); }} onNavigate={setCurrentPage} />;
    
    switch (currentPage) {
      case Page.Admin: 
        if (!isAdminAuthenticated) {
          return <SecurityGate onAuthenticated={() => setIsAdminAuthenticated(true)} onCancel={() => setCurrentPage(Page.Home)} />;
        }
        return (
          <Admin 
            orders={orders} 
            products={products} 
            setProducts={setProducts} 
            categories={categories.map(c => c.name)} 
            onNavigate={(p) => {
              if (p !== Page.Admin) setIsAdminAuthenticated(false);
              setCurrentPage(p);
            }} 
          />
        );
      case Page.Market: return (
        <Market 
          onAddToCart={(item) => setCart(prev => {
            const ex = prev.find(i => i.id === item.id);
            if (ex) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...item, quantity: 1 }];
          })} 
          cart={cart} 
          onUpdateQty={(id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + d } : i).filter(i => i.quantity > 0))}
          items={products} 
          categories={['Tous', ...categories.map(c => c.name)]} 
        />
      );
      case Page.Cart: return (
        <Cart 
          items={cart} 
          addresses={["Dakar Plateau", "Almadies", "Ouakam"]} 
          userStatus={currentUser?.status || 'Standard'}
          walletBalance={currentUser?.walletBalance || 0}
          onRemove={(id) => setCart(c => c.filter(i => i.id !== id))}
          onUpdateQty={(id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + d } : i).filter(i => i.quantity > 0))}
          onCheckout={handleCheckout}
          onNavigate={setCurrentPage} 
        />
      );
      case Page.Profile: return (
        <Profile 
          status={currentUser?.status || 'Standard'}
          addresses={[]} 
          setAddresses={() => {}} 
          walletBalance={currentUser?.walletBalance || 0}
          onReloadRequest={async (amount) => {
             await db.reloads.create({ userClientId: currentUser?.clientId, userName: currentUser?.name, amount });
             alert('Demande envoyée au protocole.');
          }}
          onLogout={handleLogout} 
          onNavigate={setCurrentPage} 
        />
      );
      case Page.Cercle: return <Cercle totalSpent={currentUser?.totalSpent || 0} onNavigate={setCurrentPage} />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden flex-col lg:flex-row">
      {isLoggedIn && currentPage !== Page.Admin && (
        <Sidebar 
          activePage={currentPage} 
          onNavigate={setCurrentPage} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          userName={currentUser?.name || ""} 
          clientId={currentUser?.clientId || ""} 
          onLogout={handleLogout}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {sysSettings.global_announcement && currentPage !== Page.Admin && (
          <div className="bg-amber-500 text-black py-1.5 px-6 text-center text-[9px] font-black uppercase tracking-widest animate-pulse z-50">
            {sysSettings.global_announcement}
          </div>
        )}
        {isLoggedIn && currentPage !== Page.Admin && (
          <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-amber-600">
                <MenuIcon size={24} />
              </button>
              <span 
                className="font-extrabold text-xl tracking-tighter text-gray-900 cursor-pointer" 
                onClick={() => { if(currentUser?.name.toLowerCase().includes('admin')) setCurrentPage(Page.Admin) }}
              >
                Visela
              </span>
            </div>
            <div className="flex items-center gap-2">
               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Connected</span>
               </div>
               <button onClick={() => setCurrentPage(Page.Profile)} className="w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-500 shadow-sm">
                  <img src="https://picsum.photos/100/100?random=88" className="w-full h-full object-cover" alt="Profile" />
               </button>
            </div>
          </header>
        )}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/50">
          {renderPage()}
        </main>
        {isLoggedIn && currentPage !== Page.Admin && <BottomNav activePage={currentPage} onNavigate={setCurrentPage} cartCount={cart.length} />}
      </div>
    </div>
  );
};

export default App;
