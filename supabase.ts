
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

const supabaseUrl = 'https://onhgefezvkrotkyvlvet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaGdlZmV6dmtyb3RreXZsdmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg0MzYzOCwiZXhwIjoyMDg0NDE5NjM4fQ.tzXd7V13h56M9umuz_nkHbRCyv9hFet5KB4H7YYXCnA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
  settings: {
    get: async (key: string) => {
      return await supabase.from('settings').select('value').eq('key', key).single();
    },
    getAll: async () => {
      return await supabase.from('settings').select('*');
    },
    update: async (key: string, value: any) => {
      return await supabase.from('settings').upsert({ key, value });
    }
  },
  logistics: {
    communes: {
      list: () => supabase.from('communes').select('*').order('name'),
      add: (name: string) => supabase.from('communes').insert([{ name }]),
      delete: (id: string) => supabase.from('communes').delete().eq('id', id)
    },
    zones: {
      list: () => supabase.from('zones').select('*, communes(name)').order('name'),
      add: (name: string, commune_id: string) => supabase.from('zones').insert([{ name, commune_id }]),
      delete: (id: string) => supabase.from('zones').delete().eq('id', id)
    },
    secteurs: {
      list: () => supabase.from('secteurs').select('*, zones(name, commune_id)').order('name'),
      add: (name: string, zone_id: string) => supabase.from('secteurs').insert([{ name, zone_id }]),
      delete: (id: string) => supabase.from('secteurs').delete().eq('id', id)
    }
  },
  profiles: {
    list: async () => {
      return await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    },
    get: async (phone: string) => {
      return await supabase.from('profiles').select('*').eq('clientId', phone).single();
    },
    update: async (id: string, updates: any) => {
      return await supabase.from('profiles').update(updates).eq('id', id);
    }
  },
  products: {
    list: async () => {
      return await supabase.from('products').select('*').order('name');
    },
    updateStock: async (id: string, newStock: number) => {
      return await supabase.from('products').update({ stock: newStock }).eq('id', id);
    },
    add: async (product: any) => {
      return await supabase.from('products').insert([product]);
    },
    delete: async (id: string) => {
      return await supabase.from('products').delete().eq('id', id);
    }
  },
  reloads: {
    list: async () => {
      return await supabase.from('reload_requests').select('*').order('created_at', { ascending: false });
    },
    create: async (request: any) => {
      return await supabase.from('reload_requests').insert([request]);
    },
    updateStatus: async (id: string, status: string) => {
      return await supabase.from('reload_requests').update({ status }).eq('id', id);
    }
  },
  orders: {
    listAll: async () => {
      return await supabase.from('orders').select('*').order('created_at', { ascending: false });
    },
    list: async (customerClientId: string) => {
      return await supabase.from('orders').select('*').eq('customerClientId', customerClientId).order('created_at', { ascending: false });
    },
    updateStatus: async (id: string, status: string) => {
      return await supabase.from('orders').update({ status }).eq('id', id);
    },
    create: async (order: any) => {
      return await supabase.from('orders').insert([order]);
    }
  }
};
