
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
// Added Subscription import
import Subscription from './pages/Subscription';
import { Menu as MenuIcon, User as UserIcon, Bell } from 'lucide-react';
import { Page, FoodItem, CartItem, Order, ReloadRequest } from './types';

const INITIAL_PRODUCTS: FoodItem[] = [
  { id: '1', name: 'Pomme Rouge Gala', description: 'Fraîches et juteuses, origine locale.', price: 1500, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400', rating: 4.8, category: 'Fruits', deliveryTime: '20 min', unit: 'Kg', unitQuantity: 1, stock: 45 },
  { id: '2', name: 'Ananas Pain Sucre', description: 'Mûrs à point, parfaits pour vos salades.', price: 2800, image: 'https://images.unsplash.com/photo-1550258114-68bd48486982?auto=format&fit=crop&q=80&w=400', rating: 4.9, category: 'Fruits', deliveryTime: '15 min', unit: 'Unité', unitQuantity: 1, stock: 3 },
  { id: '3', name: 'Truffe Noire Périgord', description: 'Exclusivité Gourmet, sélection rare.', price: 85000, image: 'https://images.unsplash.com/photo-1512411516752-77254504192d?auto=format&fit=crop&q=80&w=400', rating: 5.0, category: 'Épicerie Fine', deliveryTime: '45 min', unit: 'g', unitQuantity: 100, stock: 12, isCercleOnly: true },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // États Financiers
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(125000); // Simulation d'un historique
  const [reloadRequests, setReloadRequests] = useState<ReloadRequest[]>([]);

  const userStatus = totalSpent >= 350000 ? 'Cercle' : 'Standard';

  const [products, setProducts] = useState<FoodItem[]>(INITIAL_PRODUCTS);
  const [categories] = useState<string[]>(['Fruits', 'Légumes', 'Épicerie Fine', 'Viandes']);
  const [userAddresses, setUserAddresses] = useState<string[]>(["Plateau, Dakar"]);

  const addToCart = (item: FoodItem) => {
    if (item.isCercleOnly && userStatus !== 'Cercle') return;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleReloadRequest = (amount: number) => {
    const newReq: ReloadRequest = {
      id: 'REQ-' + Math.random().toString(36).substr(2, 9),
      userId: 'VSL-8421-A',
      userName: 'Alexandre Durand',
      amount,
      date: new Date().toLocaleString(),
      status: 'En attente'
    };
    setReloadRequests([newReq, ...reloadRequests]);
  };

  const approveReload = (id: string) => {
    const req = reloadRequests.find(r => r.id === id);
    if (req) {
      setWalletBalance(prev => prev + req.amount);
      setReloadRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Validé' } : r));
    }
  };

  const renderPage = () => {
    if (currentPage === Page.Admin) {
      return (
        <Admin 
          orders={orders} 
          products={products} 
          setProducts={setProducts} 
          categories={categories} 
          reloadRequests={reloadRequests}
          onApproveReload={approveReload}
          onUpdateStatus={(id, status) => {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
          }} 
          onNavigate={setCurrentPage} 
        />
      );
    }

    if (!isLoggedIn) {
      return <Auth onLogin={() => setIsLoggedIn(true)} onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case Page.Home: return <Home onNavigate={setCurrentPage} />;
      case Page.Market: return (
        <Market 
          onAddToCart={addToCart} 
          cart={cart} 
          onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0))} 
          items={products.filter(p => !p.isCercleOnly || userStatus === 'Cercle')} 
          categories={categories} 
        />
      );
      case Page.Cart: return (
        <Cart 
          items={cart} 
          addresses={userAddresses} 
          userStatus={userStatus}
          walletBalance={walletBalance}
          onRemove={(id) => setCart(c => c.filter(i => i.id !== id))} 
          onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0))} 
          onNavigate={setCurrentPage} 
          onCheckout={(addr, slot, method) => {
            const deliveryFee = userStatus === 'Cercle' ? 0 : 800;
            const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0) + deliveryFee;
            if (method === 'Wallet') {
              setWalletBalance(prev => prev - total);
            }
            setTotalSpent(prev => prev + total);
            const newOrder: Order = { 
              id: 'VSL-' + Math.floor(1000 + Math.random() * 9000), 
              date: new Date().toLocaleDateString('fr-FR'), 
              items: [...cart], 
              status: 'En préparation', 
              total: total, 
              deliveryAddress: addr, 
              deliverySlot: slot,
              paymentMethod: method as any
            };
            setOrders([newOrder, ...orders]); 
            setCart([]); 
            setCurrentPage(Page.Orders);
          }} 
        />
      );
      case Page.Orders: return <Orders orders={orders} />;
      case Page.Profile: return (
        <Profile 
          status={userStatus}
          addresses={userAddresses} 
          setAddresses={setUserAddresses} 
          walletBalance={walletBalance}
          onReloadRequest={handleReloadRequest}
          onLogout={() => setIsLoggedIn(false)} 
          onNavigate={setCurrentPage} 
        />
      );
      case Page.Cercle: return <Cercle totalSpent={totalSpent} onNavigate={setCurrentPage} />;
      // Added case for Subscription page rendering
      case Page.Subscription: return <Subscription />;
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
        />
      )}
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {isLoggedIn && currentPage !== Page.Admin && (
          <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                <MenuIcon size={24} />
              </button>
              <span className="font-extrabold text-xl lg:text-2xl tracking-tighter text-gray-900">Visela</span>
            </div>
            
            <div className="flex items-center gap-2">
              {userStatus === 'Cercle' && (
                <div className="px-3 py-1 bg-amber-500 text-black rounded-lg text-[9px] font-black uppercase tracking-widest hidden md:block animate-pulse">
                  Cercle Privé
                </div>
              )}
              <button onClick={() => setCurrentPage(Page.Profile)} className="w-10 h-10 rounded-xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all shadow-sm">
                <img src="https://picsum.photos/100/100?random=88" className="w-full h-full object-cover" />
              </button>
            </div>
          </header>
        )}
        
        <main className={`flex-1 overflow-y-auto no-scrollbar bg-gray-50/50 ${isLoggedIn && currentPage !== Page.Admin ? 'pb-24 lg:pb-0' : ''}`}>
          {renderPage()}
        </main>

        {isLoggedIn && currentPage !== Page.Admin && (
          <BottomNav 
            activePage={currentPage} 
            onNavigate={setCurrentPage} 
            cartCount={cart.length} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
