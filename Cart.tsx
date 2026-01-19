
import React, { useState, useMemo } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin, Calendar, X, ChevronDown, CheckCircle, Package, Sparkles, Wallet, Banknote, AlertCircle, Clock } from 'lucide-react';
import { CartItem, Page } from '../types';

interface CartProps {
  items: CartItem[];
  addresses: string[];
  userStatus: 'Standard' | 'Cercle';
  walletBalance: number;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: (address: string, slot: string, method: string) => void;
  onNavigate: (page: Page) => void;
}

const SLOTS = [
  { label: "Matin: 09h - 12h", value: "matin" },
  { label: "Soir: 13h - 17h", value: "soir" }
];

const DAYS_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

type CheckoutStep = 'items' | 'address' | 'date' | 'payment' | null;

const Cart: React.FC<CartProps> = ({ items, addresses, userStatus, walletBalance, onRemove, onUpdateQty, onCheckout, onNavigate }) => {
  const [address, setAddress] = useState(addresses[0] || '');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'Cash' | 'Wallet'>('Cash');
  const [activeStep, setActiveStep] = useState<CheckoutStep>('items');
  const [isConfirming, setIsConfirming] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? (userStatus === 'Cercle' ? 0 : 800) : 0;
  const total = subtotal + deliveryFee;

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR').format(p) + ' F';

  const availableDays = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      days.push({
        fullDate: futureDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        dayName: DAYS_NAMES[futureDate.getDay()],
      });
    }
    return days;
  }, []);

  const isOrderReady = address && selectedDay && selectedSlot && items.length > 0 && (selectedMethod !== 'Wallet' || walletBalance >= total);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] mb-6 shadow-sm">
          <ShoppingBag size={64} className="text-gray-200" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">Panier Vide</h2>
        <button onClick={() => onNavigate(Page.Market)} className="mt-6 bg-gray-900 text-amber-500 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Retour au Marché</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 relative pb-40">
      <div className="flex-1 space-y-4">
        <header className="mb-6 flex items-end gap-3 border-b border-gray-100 pb-6">
          <div className="h-10 w-1.5 bg-gray-900 rounded-full"></div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Expédition</h2>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Protocole Logistique Visela</p>
          </div>
        </header>

        <div className="space-y-3">
          {/* STEP 1: ITEMS */}
          <div className={`rounded-[2.5rem] border transition-all ${activeStep === 'items' ? 'bg-white border-amber-500 shadow-xl' : 'bg-white/50 border-gray-100'}`}>
            <button onClick={() => setActiveStep('items')} className="w-full p-6 flex justify-between items-center outline-none">
              <span className="flex items-center gap-4 text-xs font-black uppercase"><Package size={18}/> 01. Panier</span>
              {activeStep !== 'items' && <CheckCircle size={18} className="text-emerald-500" />}
            </button>
            {activeStep === 'items' && (
              <div className="p-6 pt-0 space-y-3">
                <div className="max-h-60 overflow-y-auto no-scrollbar space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="bg-gray-50/50 p-3 rounded-2xl flex gap-3 items-center">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-[9px] font-black uppercase truncate">{item.name}</p>
                        <p className="text-[8px] text-gray-400 font-bold">{item.quantity} x {formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                          <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 bg-white rounded-md shadow-sm"><Minus size={10}/></button>
                          <span className="text-[10px] font-black">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 bg-white rounded-md shadow-sm"><Plus size={10}/></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveStep('address')} className="w-full bg-gray-900 text-amber-500 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest mt-4">Confirmer Articles</button>
              </div>
            )}
          </div>

          {/* STEP 2: ADDRESS */}
          <div className={`rounded-[2.5rem] border transition-all ${activeStep === 'address' ? 'bg-white border-amber-500 shadow-xl' : 'bg-white/50 border-gray-100'}`}>
            <button onClick={() => setActiveStep('address')} className="w-full p-6 flex justify-between items-center outline-none">
              <span className="flex items-center gap-4 text-xs font-black uppercase"><MapPin size={18}/> 02. Livraison</span>
              {address && activeStep !== 'address' && <CheckCircle size={18} className="text-emerald-500" />}
            </button>
            {activeStep === 'address' && (
              <div className="p-6 pt-0 space-y-2">
                {addresses.length > 0 ? (
                  addresses.map((addr, i) => (
                    <button key={i} onClick={() => { setAddress(addr); setActiveStep('date'); }} className={`w-full p-4 rounded-xl border-2 text-left text-[9px] font-black uppercase transition-all ${address === addr ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100 hover:border-gray-300'}`}>
                      {addr}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-center text-gray-400 py-4">Aucune adresse enregistrée</p>
                )}
                <button onClick={() => onNavigate(Page.Profile)} className="w-full py-3 text-[8px] font-black text-gray-400 uppercase hover:text-gray-900">+ Gérer les adresses dans mon profil</button>
              </div>
            )}
          </div>

          {/* STEP 3: DATE & SLOT */}
          <div className={`rounded-[2.5rem] border transition-all ${activeStep === 'date' ? 'bg-white border-amber-500 shadow-xl' : 'bg-white/50 border-gray-100'}`}>
            <button onClick={() => setActiveStep('date')} className="w-full p-6 flex justify-between items-center outline-none">
              <span className="flex items-center gap-4 text-xs font-black uppercase"><Calendar size={18}/> 03. Programmation</span>
              {selectedDay && selectedSlot && activeStep !== 'date' && <CheckCircle size={18} className="text-emerald-500" />}
            </button>
            {activeStep === 'date' && (
              <div className="p-6 pt-0 space-y-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {availableDays.map((day, i) => (
                    <button key={i} onClick={() => setSelectedDay(`${day.dayName} ${day.fullDate}`)} className={`shrink-0 p-4 rounded-xl border-2 text-[9px] font-black uppercase text-center transition-all ${selectedDay?.includes(day.fullDate) ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100 hover:border-gray-300'}`}>
                      {day.dayName}<br/>{day.fullDate}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SLOTS.map(s => (
                    <button key={s.value} onClick={() => { setSelectedSlot(s.label); setActiveStep('payment'); }} className={`p-4 rounded-xl border-2 text-[9px] font-black uppercase transition-all ${selectedSlot === s.label ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100 hover:border-gray-300'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: PAYMENT */}
          <div className={`rounded-[2.5rem] border transition-all ${activeStep === 'payment' ? 'bg-white border-amber-500 shadow-xl' : 'bg-white/50 border-gray-100'}`}>
             <button onClick={() => setActiveStep('payment')} className="w-full p-6 flex justify-between items-center outline-none">
               <span className="flex items-center gap-4 text-xs font-black uppercase"><Wallet size={18}/> 04. Règlement</span>
               {selectedMethod && activeStep !== 'payment' && <CheckCircle size={18} className="text-emerald-500" />}
             </button>
             {activeStep === 'payment' && (
               <div className="p-6 pt-0 space-y-3">
                 <button 
                  onClick={() => setSelectedMethod('Wallet')} 
                  disabled={userStatus !== 'Cercle'}
                  className={`w-full p-5 rounded-2xl border-2 text-left relative transition-all ${selectedMethod === 'Wallet' ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100'} ${userStatus !== 'Cercle' ? 'opacity-30' : ''}`}
                 >
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] font-black uppercase tracking-tighter text-gray-900">Visela Wallet (Cercle)</span>
                     <Sparkles size={14} className="text-amber-500" />
                   </div>
                   <p className="text-[8px] font-black text-gray-400 uppercase">Solde: {formatPrice(walletBalance)}</p>
                 </button>
                 <button onClick={() => setSelectedMethod('Cash')} className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${selectedMethod === 'Cash' ? 'border-emerald-500 bg-emerald-50/20' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-tighter text-gray-900">Espèces à la livraison</span>
                      <Banknote size={16} className="text-emerald-500" />
                    </div>
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Recap Sticky */}
      <div className="lg:w-[350px]">
        <div className="bg-gray-900 text-white p-8 rounded-[3.5rem] sticky top-24 shadow-2xl">
          <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Récapitulatif</h3>
          <div className="space-y-3 mb-10 text-[9px] font-black uppercase tracking-widest text-gray-500">
            <div className="flex justify-between"><span>Articles</span><span className="text-white">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between items-center">
              <span>Livraison</span>
              {userStatus === 'Cercle' ? <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Offerte (Cercle)</span> : <span className="text-white">{formatPrice(deliveryFee)}</span>}
            </div>
            <div className="pt-6 mt-4 border-t border-white/10 flex justify-between text-3xl tracking-tighter text-amber-500">
              <span className="text-white text-[9px] self-end pb-1 uppercase tracking-widest">Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <button 
            disabled={!isOrderReady}
            onClick={() => setIsConfirming(true)}
            className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isOrderReady ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-gray-600'}`}
          >
            SIGNER L'ORDRE <ArrowRight size={18} />
          </button>
          {!isOrderReady && items.length > 0 && (
             <p className="text-[7px] text-center text-gray-500 uppercase mt-4 tracking-widest">Veuillez compléter toutes les étapes du protocole</p>
          )}
        </div>
      </div>

      {/* Modal Confirmation Final */}
      {isConfirming && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 relative animate-in zoom-in-95">
            <button onClick={() => setIsConfirming(false)} className="absolute top-6 right-6 text-gray-300"><X size={24} /></button>
            <h2 className="text-2xl font-black uppercase text-center mb-6">Validation Finale</h2>
            <div className="bg-gray-50 p-6 rounded-2xl space-y-3 mb-6 border border-gray-100 shadow-inner">
               <div className="flex justify-between text-[8px] font-black uppercase"><span>Destination</span><span className="text-gray-900 truncate ml-4">{address}</span></div>
               <div className="flex justify-between text-[8px] font-black uppercase"><span>Moment</span><span className="text-gray-900">{selectedDay}</span></div>
               <div className="flex justify-between text-[8px] font-black uppercase"><span>Mode</span><span className="text-amber-600 font-black">{selectedMethod}</span></div>
               <div className="pt-2 border-t border-gray-200 flex justify-between text-[10px] font-black uppercase"><span>Total Net</span><span className="text-emerald-600">{formatPrice(total)}</span></div>
            </div>
            <button onClick={() => { onCheckout(address, `${selectedDay} (${selectedSlot})`, selectedMethod); setIsConfirming(false); }} className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all">
              DÉPLOYER LA LIVRAISON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
