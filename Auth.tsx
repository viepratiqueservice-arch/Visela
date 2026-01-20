
import React, { useState } from 'react';
import { Smartphone, Lock, User as UserIcon, ArrowRight, Hash, Loader2 } from 'lucide-react';
import { Page, User } from '../types';
import { supabase } from '../services/supabase';

interface AuthProps {
  onLogin: (user: User) => void;
  onNavigate: (page: Page) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error: dbError } = await supabase
          .from('profiles')
          .select('*')
          .eq('clientId', phone)
          .single();

        if (data && data.pin === pin) {
          onLogin(data);
        } else {
          setError('Identifiants incorrects.');
        }
      } else {
        const newUser = {
          clientId: phone,
          name: name,
          email: `${phone}@visela.com`,
          pin: pin,
          status: 'Standard',
          walletBalance: 0,
          totalSpent: 0
        };

        const { data, error: regError } = await supabase
          .from('profiles')
          .insert([newUser])
          .select()
          .single();

        if (data) onLogin(data);
        else setError('Erreur lors de la création du compte.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <span className="text-black text-3xl font-serif font-bold">V</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic">Visela<span className="text-amber-500">.</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 p-3 rounded-xl">{error}</div>}
          
          {!isLogin && (
            <input 
              type="text" placeholder="Nom Complet" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-amber-500" required
            />
          )}

          <input 
            type="tel" placeholder="Numéro Mobile" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-amber-500" required
          />

          <input 
            type="password" placeholder="Code PIN (4 chiffres)" value={pin} onChange={(e) => setPin(e.target.value.slice(0, 4))}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-amber-500 text-center tracking-[1em]" required
          />

          <button 
            type="submit" disabled={loading}
            className="w-full bg-amber-500 text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'OUVRIR SESSION' : 'CRÉER COMPTE')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-amber-500">
          {isLogin ? "Demander un accès" : "Déjà titulaire d'un compte"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
