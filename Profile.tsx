
import React, { useState } from 'react';
import { MapPin, LogOut, Plus, Trash2, X, ChevronRight, Zap, Navigation, Loader2, Crown, Sparkles, Lock, Wallet, ArrowUpCircle } from 'lucide-react';
import { Page } from '../types';

interface ProfileProps {
  status: 'Standard' | 'Cercle';
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  addresses: string[];
  setAddresses: React.Dispatch<React.SetStateAction<string[]>>;
  walletBalance: number;
  onReloadRequest: (amount: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ status, onNavigate, onLogout, addresses, setAddresses, walletBalance, onReloadRequest }) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [reloadAmount, setReloadAmount] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  const isVip = status === 'Cercle';
  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR').format(p) + ' F';

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* Header Profile */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-lg border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100">
              <img src="https://picsum.photos/300/300?random=88" alt="Profile" className="w-full h-full object-cover" />
            </div>
            {isVip && (
              <div className="absolute -bottom-1 -right-1 bg-gray-900 text-amber-500 p-1.5 rounded-lg border-2 border-white shadow-md">
                <Crown size={14} />
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-tight">Alexandre Durand</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isVip ? 'bg-amber-500 text-black' : 'bg-gray-100 text-gray-400'}`}>
                {isVip ? 'Membre du Cercle' : 'Statut Standard'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Visela Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[210px] shadow-xl group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          
          {!isVip && (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-gray-900/40 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 bg-amber-500 text-black rounded-full flex items-center justify-center mb-3 shadow-lg">
                <Lock size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Exclusif au Cercle</p>
              <p className="text-[8px] text-gray-400 mt-1">Rejoignez le cercle pour activer le Wallet</p>
            </div>
          )}

          <div className={`${!isVip ? 'opacity-20 pointer-events-none' : ''} flex flex-col h-full justify-between`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em] mb-0.5">Visela Wallet</p>
                <h3 className="text-sm font-black uppercase tracking-tighter">Solde Privé</h3>
              </div>
              <button 
                onClick={() => setShowReloadModal(true)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <ArrowUpCircle size={20} className="text-amber-500" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Fonds disponibles</p>
              <h2 className="text-3xl font-black tracking-tighter text-white">{formatPrice(walletBalance)}</h2>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between items-end">
               <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Alexandre Durand</p>
               <Sparkles size={16} className="text-amber-500" />
            </div>
          </div>
        </div>

        {/* Adresses */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-tighter flex items-center gap-2 text-gray-900">
              <MapPin size={16} className="text-amber-500" /> Adresses
            </h3>
            <button onClick={() => setShowAddressModal(true)} className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-amber-600 transition-all">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
          <div className="space-y-2 max-h-[140px] overflow-y-auto no-scrollbar">
            {addresses.map((addr, idx) => (
              <div key={idx} className="bg-gray-50/50 p-3 rounded-xl border border-transparent hover:border-amber-200 transition-all flex items-center justify-between gap-2">
                <p className="text-[9px] font-bold text-gray-900 uppercase tracking-tight truncate flex-1">{addr}</p>
                <button onClick={() => setAddresses(addresses.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={onLogout} className="w-full bg-white text-red-500 py-4 rounded-[1.5rem] border border-red-50 font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
        <LogOut size={16} /> Fermer le Protocole
      </button>

      {/* Modal Recharge */}
      {showReloadModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setShowReloadModal(false)} className="absolute top-5 right-5 text-gray-300"><X size={20} /></button>
            <h3 className="text-lg font-black uppercase tracking-tighter mb-6">Recharger Wallet</h3>
            <div className="space-y-4">
              <input 
                type="number" 
                placeholder="Montant (F CFA)"
                value={reloadAmount}
                onChange={(e) => setReloadAmount(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 px-4 text-sm font-black outline-none focus:border-amber-500"
              />
              <button 
                onClick={() => { onReloadRequest(Number(reloadAmount)); setShowReloadModal(false); setReloadAmount(''); }}
                className="w-full bg-gray-900 text-amber-500 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg"
              >
                Soumettre au Protocole
              </button>
              <p className="text-[7px] text-gray-400 text-center uppercase">L'administrateur validera votre demande sous peu.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal GPS */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative shadow-2xl border-t-4 border-amber-500">
            <button onClick={() => setShowAddressModal(false)} className="absolute top-5 right-5 text-gray-300"><X size={20} /></button>
            <h3 className="text-lg font-black uppercase tracking-tighter mb-6 text-gray-900">Nouveau Lieu</h3>
            <button 
              onClick={() => {
                setIsFetchingGps(true);
                navigator.geolocation.getCurrentPosition((p) => {
                  setGpsCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
                  setIsFetchingGps(false);
                });
              }}
              className="w-full py-5 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 bg-gray-50 border-gray-200 text-gray-400"
            >
              {isFetchingGps ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
              <span className="text-[8px] font-black uppercase">{gpsCoords ? 'Signal GPS Reçu' : 'Détecter ma position'}</span>
            </button>
            <button 
              disabled={!gpsCoords} 
              onClick={() => {
                setAddresses([...addresses, `GPS: ${gpsCoords?.lat.toFixed(4)}, ${gpsCoords?.lng.toFixed(4)}`]);
                setShowAddressModal(false);
              }} 
              className="w-full bg-gray-900 disabled:bg-gray-100 text-amber-500 py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.4em] mt-4"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
