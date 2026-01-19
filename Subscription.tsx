
import React, { useState } from 'react';
import { Crown, Check, Zap, Star, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const Subscription: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Essential',
      price: billingCycle === 'monthly' ? 5000 : 45000,
      icon: Star,
      color: 'bg-gray-100',
      textColor: 'text-gray-900',
      features: ['Livraison à 500F', 'Accès Marché 24/7', 'Points Visela x1'],
      premium: false
    },
    {
      name: 'Gold Pass',
      price: billingCycle === 'monthly' ? 12000 : 110000,
      icon: Crown,
      color: 'bg-[#1A1A1A]',
      textColor: 'text-amber-500',
      features: ['Livraison OFFERTE', 'Préparation Prioritaire', 'Points Visela x2', 'Support VIP'],
      premium: true,
      popular: true
    },
    {
      name: 'Elite Elite',
      price: billingCycle === 'monthly' ? 25000 : 220000,
      icon: Sparkles,
      color: 'bg-gradient-to-br from-amber-600 to-amber-900',
      textColor: 'text-white',
      features: ['Conciergerie Dédiée', 'Produits Exclusifs VIP', 'Points Visela x5', 'Cadeau Mensuel'],
      premium: true
    }
  ];

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12 pb-40 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter">
          Visela <span className="text-amber-500 italic font-serif">Pass</span>
        </h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">L'excellence devient votre standard</p>
      </div>

      {/* Switch Facturation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Mensuel
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Annuel <span className="text-emerald-500 ml-1">-20%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative rounded-[3.5rem] p-10 flex flex-col transition-all duration-500 border-2 ${
              plan.popular ? 'border-amber-500 scale-105 shadow-2xl z-10' : 'border-gray-50 bg-white hover:border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                Le choix Gold
              </div>
            )}

            <div className={`w-16 h-16 ${plan.color} ${plan.textColor} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl`}>
              <plan.icon size={32} />
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black tracking-tighter">{new Intl.NumberFormat('fr-FR').format(plan.price)}</span>
              <span className="text-gray-400 font-bold text-xs">F / {billingCycle === 'monthly' ? 'mois' : 'an'}</span>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feat, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight text-gray-600">{feat}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
              plan.premium ? 'bg-[#1A1A1A] text-amber-500 hover:bg-black' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}>
              S'abonner maintenant <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="text-center pt-10">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center justify-center gap-3">
          <ShieldCheck size={14} /> Sécurisé par Visela Protocol • Annulable à tout moment
        </p>
      </div>
    </div>
  );
};

export default Subscription;
