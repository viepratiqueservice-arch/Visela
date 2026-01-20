
import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, ShieldAlert, Fingerprint } from 'lucide-react';

interface SecurityGateProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

const SecurityGate: React.FC<SecurityGateProps> = ({ onAuthenticated, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getExpectedPin = () => {
    const hh = currentTime.getHours().toString().padStart(2, '0');
    const mm = currentTime.getMinutes().toString().padStart(2, '0');
    const full = hh + mm;
    return full.split('').reverse().join('');
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === getExpectedPin()) {
          onAuthenticated();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#050505] flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="absolute top-10 left-10">
        <button onClick={onCancel} className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> Retour
        </button>
      </div>

      <div className="w-full max-w-xs space-y-12 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/10">
            <Fingerprint size={32} className={error ? 'text-red-500' : 'text-amber-500'} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Accès Protocole</h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mt-1">Identification Temporelle Requise</p>
          </div>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all duration-300 ${
                error 
                ? 'border-red-500 bg-red-500/10 text-red-500 animate-shake' 
                : pin.length > i 
                  ? 'border-amber-500 bg-amber-500/5 text-amber-500' 
                  : 'border-white/5 bg-white/5 text-transparent'
              }`}
            >
              {pin[i] || '•'}
            </div>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'clear'].map((key, i) => (
            <button
              key={i}
              disabled={!key || key === 'clear'}
              onClick={() => key && handleKeyPress(key)}
              className={`h-16 rounded-2xl flex items-center justify-center font-black transition-all ${
                !key || key === 'clear' 
                ? 'opacity-0' 
                : 'bg-white/5 hover:bg-white/10 active:scale-90 border border-white/5 text-lg'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="pt-8">
           <p className="text-[7px] text-gray-700 uppercase tracking-widest leading-relaxed">
             Alerte : Toute tentative non autorisée sera enregistrée dans les logs de sécurité Visela.
           </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SecurityGate;
