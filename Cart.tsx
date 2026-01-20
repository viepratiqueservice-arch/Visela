
import React, { useState, useMemo } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin, Calendar, X, CheckCircle, Package, Sparkles, Wallet, Banknote, Clock, Map } from 'lucide-react';
import { CartItem, Page } from '../types';
import LogisticsSelector from '../components/LogisticsSelector';

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

type CheckoutStep = 'items' | 'address' | 'date' | 'payment';

const Cart: React.FC<CartProps> = ({ items, addresses, userStatus, walletBalance, onRemove, onUpdateQty, onCheckout, onNavigate }) => {
  const [address, setAddress] = useState('');
  const [logisticsSelection, setLogisticsSelection] = useState({ commune: '', zone: '', secteur: '' });
  const [addressDetails, setAddressDetails] = useState('');
  
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'Cash' | 'Wallet'>('Cash');
  const [activeStep, setActiveStep] = useState<CheckoutStep>('items');
  const [isConfirming, setIsConfirming] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? (userStatus === 'Cercle' ? 0 : 800) : 0;
  const total = subtotal + deliveryFee;

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR').format(p) + ' F';

  const fullAddress = useMemo(() => {
    if (address) return address;
    if (logisticsSelection.secteur) {
      return `${logisticsSelection.secteur}, ${logisticsSelection.zone}, ${logisticsSelection.commune} - ${addressDetails}`;
    }
    return '';
  }, [address, logisticsSelection, addressDetails]);

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

  const isOrderReady = fullAddress && selectedDay && selectedSlot && items.length > 0 && (selectedMethod !== 'Wallet' || walletBalance >= total);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] mb-6 shadow-sm">
          <ShoppingBag size={64} className="text-gray-200" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">Votre Panier est vide</h2>
        <button onClick={() => onNavigate(Page.Market)} className="mt-6 bg-gray-900 text-amber-500 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Commencer mes achats</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 relative pb-40">
      <div className="flex-1 space-y-6">
        <header className="mb-8 flex items-end gap-3 border-b border-gray-100 pb-6">
          <div className="h-12 w-1.5 bg-gray-900 rounded-full"></div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 leading-none">Expédition</h2>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Visela Logistics protocol</p>
          </div>
        </header>

        <div className="space-y-4">
          {/* STEP 1: PANIER */}
          <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${activeStep === 'items' ? 'bg-white border-amber-500 shadow-xl' : 'bg-white/50 border-gray-100'}`}>
            <button onClick={() => setActiveStep('items')} className="w-full p-6 flex justify-between items-center text-xs font-black uppercase">
              <span className="flex items-center gap-4"><Package size={20}/> 01. Votre Sélection</span>
              <CheckCircle size={18} className={items.length > 0 ? 'text-emerald-500' : 'text-gray-200'} />
            </button>
            {activeStep === 'items' && (
              <div className="px-6 pb-6 space-y-3">
                {items.map(item => (
                  <div key={item.id} className="bg-gray-50/50 p-4 rounded-2xl flex gap-4 items-center">
                    <img src={item.image} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase">{item.name}</p>
                      <p className="text-[8px] text-gray-400 font-bold mt-1">{formatPrice(item.price)} / {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-100">
                        <button onClick={() => onUpdateQty(item.id, -1)} className="p-1.5 hover:bg-gray-50 rounded-md transition-colors"><Minus size={12}/></button>
                        <span className="text-[10px] font-black min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.id, 1)} className="p-1.5 hover:bg-gray-50 rounded-md transition-colors"><Plus size={12}/></button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                  </div>
                ))}
                <button onClick={() => setActiveStep('address')} className="w-full bg-gray-900 text-amber-500 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest mt-4">Confirmer le Panier</button>
              </div>
            )}
          </div>

          {/* STEP 2: LIVRAISON - LOGISTIQUE DYNAMIQUE */}
          <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${activeStep === 'address' ? 'bg-white border-amber-500 shadow-xl' : 'bg-white/50 border-gray-100'}`}>
            <button onClick={() => setActiveStep('address')} className="w-full p-6 flex justify-between items-center text-xs font-black uppercase">
              <span className="flex items-center gap-4"><MapPin size={20}/> 02. Lieu de Livraison</span>
              {fullAddress && activeStep !== 'address' && <CheckCircle size={18} className="text-emerald-500" />}
            </button>
            {activeStep === 'address' && (
              <div className="px-6 pb-6 space-y-6">
                {addresses.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2">Adresses Enregistrées</p>
                    {addresses.map((addr, i) => (
                      <button key={i} onClick={() => { setAddress(addr); setActiveStep('date'); }} className={`w-full p-5 rounded-2xl border-2 text-left text-[10px] font-black uppercase transition-all ${address === addr ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100 hover:border-gray-200'}`}>
                        {addr}
                      </button>
                    ))}
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                      <div className="relative flex justify-center"><span className="bg-white px-4 text-[8px] font-black text-gray-300 uppercase">Ou nouvelle adresse</span></div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <LogisticsSelector onSelectionComplete={(sel) => setLogisticsSelection(sel)} />
                  
                  {logisticsSelection.secteur && (
                    <div className="animate-in fade-in zoom-in-95">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Précisions (Rue, Porte, Bureau...)</label>
                      <input 
                        type="text"
                        placeholder="Ex: Rue 12, villa 45, 2ème étage..."
                        value={addressDetails}
                        onChange={(e) => setAddressDetails(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-[11px] font-black uppercase outline-none focus:border-amber-500 transition-all"
                      />
                    </div>
                  )}
                </div>

                <button 
                  disabled={!logisticsSelection.secteur}
                  onClick={() => { setAddress(''); setActiveStep('date'); }} 
                  className="w-full bg-gray-900 text-amber-500 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest mt-4 disabled:opacity-30"
                >
                  Confirmer cette destination
                </button>
              </div>
            )}
          </div>

          {/* STEP 3: PROGRAMMATION */}
          <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${activeStep === 'date' ? 'bg-white border-amber-500 shadow-xl' : 'bg-white/50 border-gray-100'}`}>
            <button onClick={() => setActiveStep('date')} className="w-full p-6 flex justify-between items-center text-xs font-black uppercase">
              <span className="flex items-center gap-4"><Clock size={20}/> 03. Planification</span>
              {selectedDay && selectedSlot && activeStep !== 'date' && <CheckCircle size={18} className="text-emerald-500" />}
            </button>
            {activeStep === 'date' && (
              <div className="px-6 pb-6 space-y-6">
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                  {availableDays.map((day, i) => (
                    <button key={i} onClick={() => setSelectedDay(`${day.dayName} ${day.fullDate}`)} className={`shrink-0 p-5 rounded-2xl border-2 text-[10px] font-black uppercase text-center min-w-[100px] transition-all ${selectedDay?.includes(day.fullDate) ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100 hover:border-gray-200'}`}>
                      {day.dayName}<br/><span className="text-[12px]">{day.fullDate}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {SLOTS.map(s => (
                    <button key={s.value} onClick={() => { setSelectedSlot(s.label); setActiveStep('payment'); }} className={`p-5 rounded-2xl border-2 text-[10px] font-black uppercase text-center transition-all ${selectedSlot === s.label ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100 hover:border-gray-200'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: PAIEMENT */}
          <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${activeStep === 'payment' ? 'bg-white border-amber-500 shadow-xl' : 'bg-white/50 border-gray-100'}`}>
             <button onClick={() => setActiveStep('payment')} className="w-full p-6 flex justify-between items-center text-xs font-black uppercase">
               <span className="flex items-center gap-4"><Wallet size={20}/> 04. Règlement</span>
             </button>
             {activeStep === 'payment' && (
               <div className="px-6 pb-6 space-y-3">
                 <button 
                  onClick={() => setSelectedMethod('Wallet')} 
                  disabled={userStatus !== 'Cercle'}
                  className={`w-full p-6 rounded-3xl border-2 text-left relative transition-all ${selectedMethod === 'Wallet' ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100'} ${userStatus !== 'Cercle' ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:border-amber-300'}`}
                 >
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-[11px] font-black uppercase tracking-tighter text-gray-900">Visela Wallet (Le Cercle)</span>
                     <Sparkles size={16} className="text-amber-500" />
                   </div>
                   <p className="text-[9px] font-black text-gray-400 uppercase">Solde disponible: {formatPrice(walletBalance)}</p>
                   {userStatus !== 'Cercle' && <p className="text-[7px] text-amber-600 font-black uppercase mt-2">Réservé aux membres du Cercle</p>}
                 </button>
                 <button onClick={() => setSelectedMethod('Cash')} className={`w-full p-6 rounded-3xl border-2 text-left transition-all ${selectedMethod === 'Cash' ? 'border-emerald-500 bg-emerald-50/20' : 'border-gray-100 hover:border-emerald-300'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase tracking-tighter text-gray-900">Espèces à la livraison</span>
                      <Banknote size={18} className="text-emerald-500" />
                    </div>
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Recap Sticky */}
      <div className="lg:w-[380px]">
        <div className="bg-gray-900 text-white p-10 rounded-[4rem] sticky top-24 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <h3 className="text-2xl font-black mb-10 uppercase tracking-tighter relative z-10">Facturation</h3>
          
          <div className="space-y-4 mb-12 text-[10px] font-black uppercase tracking-widest text-gray-500 relative z-10">
            <div className="flex justify-between items-center">
              <span>Articles</span>
              <span className="text-white text-base">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Livraison</span>
              {userStatus === 'Cercle' ? (
                <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[8px]">Gratuite (Cercle)</span>
              ) : (
                <span className="text-white text-base">{formatPrice(deliveryFee)}</span>
              )}
            </div>
            <div className="pt-8 mt-6 border-t border-white/10 flex justify-between items-end text-white">
              <span className="text-[10px] uppercase tracking-[0.4em] mb-1">Net à Payer</span>
              <span className="text-4xl font-black tracking-tighter text-amber-500 leading-none">{formatPrice(total)}</span>
            </div>
          </div>

          <button 
            disabled={!isOrderReady}
            onClick={() => setIsConfirming(true)}
            className={`w-full py-7 rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all relative z-10 ${isOrderReady ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/30' : 'bg-white/5 text-gray-600'}`}
          >
            VALIDER L'EXPÉDITION <ArrowRight size={20} />
          </button>
          
          {!isOrderReady && items.length > 0 && (
             <p className="text-[8px] text-center text-gray-500 uppercase mt-6 tracking-widest animate-pulse">Veuillez finaliser les 4 étapes</p>
          )}
        </div>
      </div>

      {/* Modal Confirmation */}
      {isConfirming && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
          <div className="bg-white w-full max-sm rounded-[4rem] p-10 relative animate-in zoom-in-95 shadow-2xl border border-white/20">
            <button onClick={() => setIsConfirming(false)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-colors"><X size={28} /></button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-900 text-amber-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Sparkles size={32} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Confirmation</h2>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Signature du protocole Visela</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-[2rem] space-y-4 mb-10 border border-gray-100 shadow-inner">
               <div className="flex flex-col gap-1">
                 <span className="text-[7px] font-black uppercase text-gray-400">Destination</span>
                 <span className="text-[10px] font-bold text-gray-900 truncate">{fullAddress}</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-[7px] font-black uppercase text-gray-400">Moment Prévu</span>
                 <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tighter">{selectedDay} ({selectedSlot})</span>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                 <span className="text-[8px] font-black uppercase text-gray-900">Total</span>
                 <span className="text-xl font-black text-emerald-600 tracking-tighter">{formatPrice(total)}</span>
               </div>
            </div>
            
            <button onClick={() => { onCheckout(fullAddress, `${selectedDay} (${selectedSlot})`, selectedMethod); setIsConfirming(false); }} className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-black transition-all transform active:scale-95">
              CONFIRMER L'ORDRE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
