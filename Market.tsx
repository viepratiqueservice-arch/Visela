
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, X, ShoppingBasket, Star, LayoutGrid, Grid3X3 } from 'lucide-react';
import { FoodItem, CartItem } from '../types';

interface MarketProps {
  onAddToCart: (item: FoodItem) => void;
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  items: FoodItem[];
  categories: string[];
}

const Market: React.FC<MarketProps> = ({ onAddToCart, cart, items, categories }) => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<FoodItem | null>(null);
  const [cols, setCols] = useState<2 | 3>(2); // État pour le nombre de colonnes sur mobile

  const filteredItems = useMemo(() => {
    let res = [...items];
    if (activeCategory !== 'Tous') res = res.filter(i => i.category === activeCategory);
    if (searchQuery) res = res.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return res;
  }, [activeCategory, searchQuery, items]);

  const getQuantity = (id: string) => cart.find(i => i.id === id)?.quantity || 0;
  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR').format(p) + ' F';

  return (
    <div className="p-3 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-10 animate-fade-in">
      
      {/* Search and Filters - Compact & Switcher de colonnes */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none rounded-2xl py-3 pl-10 pr-4 text-xs shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          {/* Switcher de colonnes mobile uniquement */}
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 lg:hidden">
            <button 
              onClick={() => setCols(2)}
              className={`p-2 rounded-lg transition-all ${cols === 2 ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setCols(3)}
              className={`p-2 rounded-lg transition-all ${cols === 3 ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400'}`}
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setActiveCategory('Tous')}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === 'Tous' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            Tous
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid - Dynamique selon l'état 'cols' sur mobile */}
      <div className={`grid gap-2 md:gap-6 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'} md:grid-cols-3 lg:grid-cols-4`}>
        {filteredItems.map(item => {
          const qty = getQuantity(item.id);
          return (
            <div key={item.id} className="group bg-white rounded-[1.2rem] md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-gray-50">
              <div 
                className="aspect-[5/4] relative overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => setSelectedProduct(item)}
              >
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.name} />
                <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-full text-[7px] md:text-[10px] font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                  <Star size={8} className="text-orange-500 fill-orange-500" /> {item.rating}
                </div>
                {qty > 0 && (
                  <div className="absolute top-1.5 right-1.5 bg-orange-600 text-white text-[8px] md:text-[10px] font-black w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    {qty}
                  </div>
                )}
              </div>
              <div className="p-2 md:p-5 space-y-1 md:space-y-3 flex-1 flex flex-col">
                <div className="flex-1 min-h-[2.5rem] md:min-h-0">
                  <p className="text-[7px] md:text-[10px] font-black text-orange-600 uppercase tracking-widest">{item.category}</p>
                  <h3 className={`font-bold text-gray-900 leading-tight mt-0.5 line-clamp-1 ${cols === 3 ? 'text-[9px]' : 'text-[11px] md:text-base'}`}>
                    {item.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className={`font-black text-gray-900 tracking-tighter ${cols === 3 ? 'text-[10px]' : 'text-xs md:text-lg'}`}>
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-[7px] md:text-[10px] text-gray-400 font-bold uppercase tracking-tighter">/ {item.unit}</span>
                  </div>
                  <button 
                    onClick={() => onAddToCart(item)}
                    className={`bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg active:scale-90 ${cols === 3 ? 'w-6 h-6' : 'w-8 h-8 md:w-11 md:h-11'}`}
                  >
                    <Plus size={cols === 3 ? 12 : 16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Détails - Optimisé */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-gray-500 hover:text-black transition-all shadow-sm"
            >
              <X size={18} />
            </button>
            <div className="md:w-5/12 aspect-[4/3] md:aspect-auto bg-gray-100">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
            </div>
            <div className="md:w-7/12 p-6 md:p-8 space-y-4 flex flex-col justify-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">{selectedProduct.category}</span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mt-1 uppercase tracking-tighter">{selectedProduct.name}</h2>
              </div>
              <p className="text-gray-500 text-[10px] md:text-xs leading-relaxed italic opacity-80">"{selectedProduct.description}"</p>
              <div className="flex items-center justify-between py-1 border-y border-gray-50 my-2">
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 tracking-tighter">{formatPrice(selectedProduct.price)}</span>
                  <span className="text-gray-400 text-[9px] font-medium uppercase tracking-wider">Prix au {selectedProduct.unit}</span>
                </div>
              </div>
              <button 
                onClick={() => { onAddToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-[10px] flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
              >
                <ShoppingBasket size={16} /> Ajouter au Panier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
