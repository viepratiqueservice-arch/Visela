
import React from 'react';
import { Home, ShoppingBasket, ShoppingCart, Package } from 'lucide-react';
import { Page } from '../types';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate, cartCount }) => {
  const items = [
    { id: Page.Home, label: 'Accueil', icon: Home },
    { id: Page.Market, label: 'Marché', icon: ShoppingBasket },
    { id: Page.Cart, label: 'Panier', icon: ShoppingCart, count: cartCount },
    { id: Page.Orders, label: 'Commandes', icon: Package },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 lg:hidden">
      <nav className="bg-white border border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl flex items-center justify-around py-3 px-2">
        {items.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 flex-1 transition-all duration-200 ${
                isActive ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <div className={`p-2 rounded-xl relative ${isActive ? 'bg-emerald-50' : ''}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 border-2 border-white">
                    {item.count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
