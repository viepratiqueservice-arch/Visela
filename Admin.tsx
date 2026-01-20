
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, Wallet, Settings, 
  Plus, Trash2, Camera, Upload, ArrowLeft, 
  MapPin, CheckCircle, XCircle, AlertCircle, 
  ChevronRight, Save, Globe, Phone, ListChecks, Database,
  Navigation
} from 'lucide-react';
import { Order, Page, FoodItem, ReloadRequest, User, Commune, Zone, Secteur } from '../types';
import { db, supabase } from '../services/supabase';

interface AdminProps {
  orders: Order[];
  products: FoodItem[];
  setProducts: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  categories: string[];
  onNavigate: (page: Page) => void;
}

const Admin: React.FC<AdminProps> = ({ products, categories, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSettingsTab, setActiveSettingsTab] = useState('global');
  
  // States pour les données
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allProfiles, setAllProfiles] = useState<User[]>([]);
  const [reloads, setReloads] = useState<ReloadRequest[]>([]);
  const [sysSettings, setSysSettings] = useState<Record<string, any>>({});
  
  // States Logistique
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [secteurs, setSecteurs] = useState<any[]>([]);
  
  // Formulaire Produit
  const [showAddProduct, setShowAddProduct] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProd, setNewProd] = useState({ 
    name: '', price: '', category: categories[0] || 'Fruits', 
    stock: '10', unit: 'Kg', image: '', description: '' 
  });

  // Chargement des données
  const fetchData = async () => {
    const [ordersRes, profilesRes, reloadsRes, settingsRes, communesRes, zonesRes, secteursRes] = await Promise.all([
      db.orders.listAll(),
      db.profiles.list(),
      db.reloads.list(),
      db.settings.getAll(),
      db.logistics.communes.list(),
      db.logistics.zones.list(),
      db.logistics.secteurs.list()
    ]);

    if (ordersRes.data) setAllOrders(ordersRes.data);
    if (profilesRes.data) setAllProfiles(profilesRes.data);
    if (reloadsRes.data) setReloads(reloadsRes.data);
    if (settingsRes.data) {
      const config: any = {};
      settingsRes.data.forEach(item => { config[item.key] = item.value; });
      setSysSettings(config);
    }
    if (communesRes.data) setCommunes(communesRes.data);
    if (zonesRes.data) setZones(zonesRes.data);
    if (secteursRes.data) setSecteurs(secteursRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Actions
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProd({ ...newProd, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = async () => {
    if (!newProd.name || !newProd.price || !newProd.image) return alert('Veuillez remplir les champs obligatoires.');
    const { error } = await db.products.add({
      name: newProd.name,
      price: Number(newProd.price),
      category: newProd.category,
      stock: Number(newProd.stock),
      unit: newProd.unit,
      image: newProd.image,
      description: newProd.description,
      unitQuantity: 1,
      rating: 4.5,
      isCercleOnly: false
    });
    if (!error) {
      setShowAddProduct(false);
      fetchData();
    }
  };

  const updateSetting = async (key: string, value: any) => {
    await db.settings.update(key, value);
    setSysSettings({ ...sysSettings, [key]: value });
  };

  const addCommune = async () => {
    const name = prompt('Nom de la commune :');
    if (name) await db.logistics.communes.add(name);
    fetchData();
  };

  const addZone = async () => {
    const name = prompt('Nom de la zone :');
    const communeId = prompt('ID de la commune (liste disponible) :');
    if (name && communeId) await db.logistics.zones.add(name, communeId);
    fetchData();
  };

  const addSecteur = async () => {
    const name = prompt('Nom du secteur :');
    const zoneId = prompt('ID de la zone :');
    if (name && zoneId) await db.logistics.secteurs.add(name, zoneId);
    fetchData();
  };

  return (
    <div className="flex h-screen bg-[#0F1115] text-white">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-[#0A0C10]">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black font-black">V</div>
           <h1 className="text-xl font-black uppercase tracking-tighter">Master</h1>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Catalogue', icon: Box },
            { id: 'logistics', label: 'Logistique', icon: MapPin },
            { id: 'orders', label: 'Commandes', icon: Truck },
            { id: 'users', label: 'Clients', icon: Users },
            { id: 'wallet', label: 'Finances', icon: Wallet },
            { id: 'settings', label: 'Paramètres', icon: Settings },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl uppercase text-[10px] font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:bg-white/5'}`}>
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={() => onNavigate(Page.Home)} className="p-4 text-gray-500 flex items-center gap-2 text-[10px] font-black uppercase border-t border-white/5"><ArrowLeft size={16}/> Quitter</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto no-scrollbar">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Analytics</h2>
            <div className="grid grid-cols-4 gap-6">
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-2">Ventes Totales</p>
                  <p className="text-3xl font-black tracking-tighter text-emerald-500">
                    {new Intl.NumberFormat('fr-FR').format(allOrders.reduce((a, b) => a + (b.total || 0), 0))} F
                  </p>
               </div>
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-2">Commandes</p>
                  <p className="text-3xl font-black tracking-tighter">{allOrders.length}</p>
               </div>
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-2">Clients actifs</p>
                  <p className="text-3xl font-black tracking-tighter text-amber-500">{allProfiles.length}</p>
               </div>
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-2">Disponibilité</p>
                  <p className={`text-xl font-black uppercase ${sysSettings.store_open ? 'text-emerald-500' : 'text-red-500'}`}>
                    {sysSettings.store_open ? 'OUVERT' : 'FERMÉ'}
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* CATALOGUE */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Catalogue Produits</h2>
              <button onClick={() => setShowAddProduct(true)} className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 active:scale-95 transition-all shadow-lg shadow-amber-500/20">
                <Plus size={18}/> Ajouter un article
              </button>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white/5 p-5 rounded-[2rem] border border-white/5 relative group overflow-hidden">
                  <img src={p.image} className="w-full h-40 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform" />
                  <p className="text-amber-500 text-[8px] font-black uppercase tracking-widest">{p.category}</p>
                  <h4 className="text-sm font-black uppercase truncate">{p.name}</h4>
                  <div className="flex justify-between items-end mt-4">
                     <p className="text-lg font-black">{p.price} F</p>
                     <p className={`text-[10px] font-bold ${p.stock < 5 ? 'text-red-500' : 'text-gray-500'}`}>Stock: {p.stock}</p>
                  </div>
                  <button onClick={async () => { if(confirm('Supprimer cet article ?')) await db.products.delete(p.id); fetchData(); }} className="absolute top-4 right-4 bg-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Ajout Produit */}
            {showAddProduct && (
              <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="bg-[#161920] w-full max-w-2xl rounded-[3rem] p-10 border border-white/10 space-y-6 overflow-y-auto no-scrollbar max-h-[90vh]">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Nouveau Produit</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Image du produit</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden"
                        >
                          {newProd.image ? (
                            <img src={newProd.image} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Camera className="text-amber-500 mb-2" size={32} />
                              <span className="text-[10px] font-black uppercase">Prendre / Choisir</span>
                            </>
                          )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageSelection} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <input type="text" placeholder="Nom de l'article" className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 text-sm" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
                      <div className="flex gap-4">
                        <input type="number" placeholder="Prix" className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 text-sm" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} />
                        <input type="text" placeholder="Unité" className="w-32 bg-white/5 p-4 rounded-xl outline-none border border-white/10 text-sm" value={newProd.unit} onChange={e => setNewProd({...newProd, unit: e.target.value})} />
                      </div>
                      <select className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 text-sm text-white" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})}>
                        {categories.map(c => <option key={c} value={c} className="bg-[#161920]">{c}</option>)}
                      </select>
                      <input type="number" placeholder="Stock initial" className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 text-sm" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} />
                      <textarea placeholder="Description courte..." className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/10 text-sm min-h-[100px]" value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowAddProduct(false)} className="flex-1 p-5 bg-white/5 rounded-2xl uppercase font-black text-[10px]">Annuler</button>
                    <button onClick={saveProduct} className="flex-1 p-5 bg-amber-500 text-black rounded-2xl uppercase font-black text-[10px] shadow-lg shadow-amber-500/20">Enregistrer l'article</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LOGISTIQUE */}
        {activeTab === 'logistics' && (
          <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Logistique de Livraison</h2>
            
            <div className="grid grid-cols-3 gap-8">
              {/* Communes */}
              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black uppercase text-sm flex items-center gap-2"><Globe size={18} className="text-blue-500" /> Communes</h3>
                  <button onClick={addCommune} className="bg-blue-500 p-2 rounded-lg"><Plus size={16}/></button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                  {communes.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold uppercase">{c.name}</span>
                      <button onClick={async () => { await db.logistics.communes.delete(c.id); fetchData(); }} className="text-red-500 hover:text-red-400"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zones */}
              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  {/* Added missing Navigation icon from lucide-react */}
                  <h3 className="font-black uppercase text-sm flex items-center gap-2"><Navigation size={18} className="text-emerald-500" /> Zones</h3>
                  <button onClick={addZone} className="bg-emerald-500 p-2 rounded-lg text-black"><Plus size={16}/></button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                  {zones.map(z => (
                    <div key={z.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <div>
                        <p className="text-[10px] font-bold uppercase">{z.name}</p>
                        <p className="text-[7px] text-gray-500 uppercase">{z.communes?.name}</p>
                      </div>
                      <button onClick={async () => { await db.logistics.zones.delete(z.id); fetchData(); }} className="text-red-400"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secteurs */}
              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black uppercase text-sm flex items-center gap-2"><MapPin size={18} className="text-amber-500" /> Secteurs</h3>
                  <button onClick={addSecteur} className="bg-amber-500 p-2 rounded-lg text-black"><Plus size={16}/></button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                  {secteurs.map(s => (
                    <div key={s.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <div>
                        <p className="text-[10px] font-bold uppercase">{s.name}</p>
                        <p className="text-[7px] text-gray-500 uppercase">Zone: {s.zones?.name}</p>
                      </div>
                      <button onClick={async () => { await db.logistics.secteurs.delete(s.id); fetchData(); }} className="text-red-400"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS - Les 20 fonctionnalités */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Configuration Système</h2>
            
            <div className="flex gap-4 border-b border-white/5 pb-4">
              {['global', 'finance', 'interface'].map(st => (
                <button key={st} onClick={() => setActiveSettingsTab(st)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeSettingsTab === st ? 'bg-white text-black' : 'text-gray-500'}`}>
                  {st}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
              {activeSettingsTab === 'global' && (
                <>
                  <SettingField label="Mode Boutique" desc="Ouvrir ou fermer l'app." type="toggle" value={sysSettings.store_open} onChange={v => updateSetting('store_open', v)} />
                  <SettingField label="Annonce Globale" desc="Bandeau défilant haut." type="text" value={sysSettings.global_announcement} onChange={v => updateSetting('global_announcement', v)} />
                  <SettingField label="Seuil Cercle" desc="Montant min. membre VIP." type="number" value={sysSettings.cercle_threshold} onChange={v => updateSetting('cercle_threshold', v)} />
                  <SettingField label="Frais Livraison" desc="Prix standard par défaut." type="number" value={sysSettings.delivery_fee} onChange={v => updateSetting('delivery_fee', v)} />
                  <SettingField label="Temps de Préparation" desc="Délai min (minutes)." type="number" value={sysSettings.prep_time || 30} onChange={v => updateSetting('prep_time', v)} />
                  <SettingField label="Version App" desc="Affichage version système." type="text" value={sysSettings.version || '1.0.4'} onChange={v => updateSetting('version', v)} />
                </>
              )}
              {activeSettingsTab === 'finance' && (
                <>
                  <SettingField label="Ratio Points" desc="Points par 1000 F dépensés." type="number" value={sysSettings.points_ratio || 10} onChange={v => updateSetting('points_ratio', v)} />
                  <SettingField label="Bonus Parrainage" desc="Gain par nouvel inscrit." type="number" value={sysSettings.referral_bonus || 500} onChange={v => updateSetting('referral_bonus', v)} />
                  <SettingField label="Devise" desc="Symbole monétaire." type="text" value={sysSettings.currency || 'F CFA'} onChange={v => updateSetting('currency', v)} />
                  <SettingField label="Commande Minimum" desc="Montant min pour valider." type="number" value={sysSettings.min_order || 2000} onChange={v => updateSetting('min_order', v)} />
                </>
              )}
            </div>
          </div>
        )}

        {/* FINANCES (Wallet approval) */}
        {activeTab === 'wallet' && (
          <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Flux Financiers</h2>
            <div className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="p-8">Date</th>
                      <th className="p-8">Client</th>
                      <th className="p-8">Montant</th>
                      <th className="p-8">Statut</th>
                      <th className="p-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reloads.map(r => (
                      <tr key={r.id}>
                        <td className="p-8 text-[10px] text-gray-400">{new Date(r.created_at).toLocaleString()}</td>
                        <td className="p-8">
                           <p className="font-bold uppercase text-[11px]">{r.userName}</p>
                           <p className="text-[8px] text-gray-500">ID: {r.userClientId}</p>
                        </td>
                        <td className="p-8 font-black text-emerald-500">{r.amount} F</td>
                        <td className="p-8">
                           <span className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-lg ${r.status === 'En attente' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                             {r.status}
                           </span>
                        </td>
                        <td className="p-8">
                          {r.status === 'En attente' && (
                            <button onClick={() => { if(confirm('Valider la recharge ?')) db.reloads.updateStatus(r.id, 'Validé'); fetchData(); }} className="bg-emerald-500 text-black px-6 py-3 rounded-xl text-[9px] font-black uppercase active:scale-95 transition-all">Approuver</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

// Petit composant utilitaire pour les réglages
const SettingField = ({ label, desc, type, value, onChange }: any) => (
  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
    <div className="space-y-1">
      <h4 className="font-black uppercase text-sm tracking-tight">{label}</h4>
      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{desc}</p>
    </div>
    {type === 'toggle' ? (
      <button onClick={() => onChange(!value)} className={`w-14 h-8 rounded-full transition-all relative ${value ? 'bg-emerald-500' : 'bg-white/10'}`}>
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`}></div>
      </button>
    ) : (
      <input 
        type={type} 
        value={value || ''} 
        onChange={e => onChange(e.target.value)}
        className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500 w-48 text-right"
      />
    )}
  </div>
);

export default Admin;
