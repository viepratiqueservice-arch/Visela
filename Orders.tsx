
import React, { useState } from 'react';
import { Package, CheckCircle, Clock, ChevronRight, Truck, Search, ShoppingBag, X, MapPin, Calendar, CreditCard, Sparkles } from 'lucide-react';
import { Order, CartItem } from '../types';

interface OrdersProps {
  orders: Order[];
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  const [filter, setFilter] = useState('TOUS');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR').format(p) + ' F';

  const filteredOrders = orders.filter(o => {
    if (filter === 'TOUS') return true;
    if (filter === 'EN ATTENTE') return o.status === 'En préparation';
    if (filter === 'EN COURS') return o.status === 'En livraison';
    if (filter === 'LIVRÉS') return o.status === 'Livré';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En préparation': return 'text-amber-500';
      case 'En livraison': return 'text-blue-500';
      case 'Livré': return 'text-emerald-500';
      default: return 'text-gray-400';
    }
  };

  const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-40 animate-in fade-in duration-700">
      
      {/* Header compact */}
      <div className="flex items-end justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">Mes Colis</h1>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Logistique Visela</p>
        </div>
        <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg">
           <span className="text-[9px] font-black uppercase tracking-widest">{orders.length} Flux</span>
        </div>
      </div>

      {/* Tabs compactes */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
        {['TOUS', 'EN ATTENTE', 'EN COURS', 'LIVRÉS'].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all shrink-0 border-2 ${
              filter === tab 
              ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
              : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List compactée */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div 
            key={order.id} 
            onClick={() => setSelectedOrder(order)}
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer active:scale-[0.99]"
          >
            <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-md ${order.status === 'Livré' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {order.status === 'Livré' ? <CheckCircle size={22} /> : <Clock size={22} />}
                </div>
                
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-lg text-gray-900 tracking-tighter">#{order.id}</h4>
                    <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-gray-50 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">{order.date} • {order.items.length} Articles</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                  <p className="text-lg font-black text-gray-900 tracking-tighter">{formatPrice(order.total)}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>

            {/* Stepper minimaliste */}
            <div className="px-5 pb-5">
              <div className="relative h-1 bg-gray-100 rounded-full">
                <div className={`absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-1000 ${order.status === 'En préparation' ? 'w-1/3' : order.status === 'En livraison' ? 'w-2/3' : 'w-full'}`}></div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <ShoppingBag size={32} className="text-gray-200 mb-3" />
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Aucun historique</p>
          </div>
        )}
      </div>

      {/* Modal Détails (Inchangé mais compacté en UI) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col border border-white/20 animate-in zoom-in-95 duration-300 max-h-[85vh]">
            <div className="bg-gray-900 p-6 text-white relative shrink-0">
               <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/60 transition-all z-20">
                 <X size={18} />
               </button>
               <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Commande #{selectedOrder.id}</h2>
               <p className="text-[10px] text-gray-400 mt-2">{selectedOrder.date}</p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                  <MapPin size={16} className="text-amber-600 shrink-0" />
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase">Adresse</p>
                    <p className="text-[9px] font-bold text-gray-900 uppercase truncate">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                  <Calendar size={16} className="text-blue-600 shrink-0" />
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase">Créneau</p>
                    <p className="text-[9px] font-bold text-gray-900 uppercase truncate">{selectedOrder.deliverySlot}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-gray-50 rounded-xl">
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt={item.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[9px] font-black text-gray-900 uppercase truncate">{item.name}</h4>
                      <p className="text-[8px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[10px] font-black text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900 rounded-3xl p-6 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.4em] text-amber-500 mb-1">Total Payé</p>
                    <span className="text-2xl font-black tracking-tighter">{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                    <CreditCard size={12} className="text-amber-500" />
                    <span className="text-[7px] font-black uppercase tracking-widest">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
