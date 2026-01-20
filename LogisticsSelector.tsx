
import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { db } from '../services/supabase';
import { Commune, Zone, Secteur } from '../types';

interface LogisticsSelectorProps {
  onSelectionComplete: (selection: { commune: string, zone: string, secteur: string }) => void;
}

const LogisticsSelector: React.FC<LogisticsSelectorProps> = ({ onSelectionComplete }) => {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [secteurs, setSecteurs] = useState<Secteur[]>([]);
  
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedSecteur, setSelectedSecteur] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCommunes = async () => {
      const { data } = await db.logistics.communes.list();
      if (data) setCommunes(data);
    };
    fetchCommunes();
  }, []);

  const handleCommuneChange = async (id: string) => {
    setSelectedCommune(id);
    setSelectedZone('');
    setSelectedSecteur('');
    setLoading(true);
    const { data } = await db.logistics.zones.list();
    if (data) setZones(data.filter((z: any) => z.commune_id === id));
    setLoading(false);
  };

  const handleZoneChange = async (id: string) => {
    setSelectedZone(id);
    setSelectedSecteur('');
    setLoading(true);
    const { data } = await db.logistics.secteurs.list();
    if (data) setSecteurs(data.filter((s: any) => s.zone_id === id));
    setLoading(false);
  };

  const handleSecteurChange = (id: string) => {
    setSelectedSecteur(id);
    const cName = communes.find(c => c.id === selectedCommune)?.name || '';
    const zName = zones.find(z => z.id === selectedZone)?.name || '';
    const sName = secteurs.find(s => s.id === id)?.name || '';
    onSelectionComplete({ commune: cName, zone: zName, secteur: sName });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      {/* Commune */}
      <div className="relative">
        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Commune</label>
        <select 
          value={selectedCommune}
          onChange={(e) => handleCommuneChange(e.target.value)}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-[11px] font-black uppercase outline-none focus:border-amber-500 appearance-none transition-all"
        >
          <option value="">Sélectionner une commune</option>
          {communes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-6 bottom-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Zone */}
      {selectedCommune && (
        <div className="relative">
          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Zone</label>
          <select 
            value={selectedZone}
            onChange={(e) => handleZoneChange(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-[11px] font-black uppercase outline-none focus:border-amber-500 appearance-none transition-all disabled:opacity-50"
          >
            <option value="">Sélectionner une zone</option>
            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
          {loading ? <Loader2 size={16} className="absolute right-6 bottom-5 text-amber-500 animate-spin" /> : <ChevronDown size={16} className="absolute right-6 bottom-5 text-gray-400 pointer-events-none" />}
        </div>
      )}

      {/* Secteur */}
      {selectedZone && (
        <div className="relative">
          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Secteur</label>
          <select 
            value={selectedSecteur}
            onChange={(e) => handleSecteurChange(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-[11px] font-black uppercase outline-none focus:border-amber-500 appearance-none transition-all disabled:opacity-50"
          >
            <option value="">Sélectionner un secteur</option>
            {secteurs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-6 bottom-5 text-gray-400 pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default LogisticsSelector;
