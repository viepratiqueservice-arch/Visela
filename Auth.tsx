
import React, { useState } from 'react';
import { Smartphone, Lock, User, ArrowRight, ShieldAlert, Hash } from 'lucide-react';
import { Page } from '../types';

interface AuthProps {
  onLogin: () => void;
  onNavigate: (page: Page) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 5) {
      setShowAdminAccess(true);
      setLogoClicks(0);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d\s+]/g, '');
    setPhone(val);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10 group">
          <button 
            onClick={handleLogoClick}
            className={`w-24 h-24 bg-gray-900 p-1 rounded-xl shadow-2xl border-2 border-[#D4AF37] mb-4 transition-all active:scale-90 flex items-center justify-center ${logoClicks > 0 ? 'scale-110 rotate-3' : ''}`}
          >
            <span className="text-[#D4AF37] text-6xl font-serif font-bold">V</span>
          </button>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase">
            Visela<span className="text-amber-500">.</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2 text-center">Protocol de Livraison de Luxe</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border-2 border-gray-50 relative overflow-hidden">
          {showAdminAccess && (
            <div className="absolute top-0 left-0 right-0 bg-gray-900 p-4 flex items-center justify-between animate-in slide-in-from-top duration-500 z-50 border-b-2 border-[#D4AF37]">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Master Console Link</span>
              </div>
              <button 
                type="button"
                onClick={() => onNavigate(Page.Admin)}
                className="text-white text-[9px] font-black uppercase tracking-widest bg-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
              >
                Accès Admin
              </button>
            </div>
          )}

          <div className="flex gap-8 mb-10 border-b border-gray-100 pb-2">
            <button 
              onClick={() => setIsLogin(true)}
              className={`pb-4 font-black text-[11px] uppercase tracking-widest transition-all relative ${isLogin ? 'text-gray-900' : 'text-gray-300'}`}
            >
              Identification
              {isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37] rounded-full"></div>}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`pb-4 font-black text-[11px] uppercase tracking-widest transition-all relative ${!isLogin ? 'text-gray-900' : 'text-gray-300'}`}
            >
              Enregistrement
              {!isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37] rounded-full"></div>}
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du Titulaire</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Alexandre Durand"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-black focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Numéro de Téléphone</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" 
                  placeholder="00 00 00 00 00"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-black focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Code PIN Secret (4 chiffres)</label>
              </div>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="••••"
                  value={pin}
                  onChange={handlePinChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-xl font-black tracking-[1em] text-black focus:ring-2 focus:ring-amber-500 transition-all outline-none text-center"
                  required
                />
              </div>
              <p className="text-[8px] text-gray-400 uppercase font-bold text-center italic">Le PIN remplace le mot de passe pour plus de rapidité.</p>
            </div>

            <button 
              type="submit"
              disabled={pin.length < 4 || phone.length < 8}
              className="w-full bg-black disabled:bg-gray-200 text-amber-500 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all flex items-center justify-center gap-3 mt-8 active:scale-[0.98]"
            >
              {isLogin ? 'ACCÉDER AU PROTOCOLE' : "CRÉER MON ID VISELA"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              {isLogin ? "Nouveau chez Visela ?" : "Déjà un ID client ?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-600 ml-2 hover:underline"
              >
                {isLogin ? "Demander un accès" : "S'identifier"}
              </button>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">
          Visela Security Module • Active
        </p>
      </div>
    </div>
  );
};

export default Auth;
