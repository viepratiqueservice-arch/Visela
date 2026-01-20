
export enum Page {
  Auth = 'Auth',
  Home = 'Home',
  Cart = 'Cart',
  Orders = 'Orders',
  Profile = 'Profile',
  Market = 'Market',
  Admin = 'Admin',
  Cercle = 'Cercle'
}

export interface Commune {
  id: string;
  name: string;
}

export interface Zone {
  id: string;
  commune_id: string;
  name: string;
}

export interface Secteur {
  id: string;
  zone_id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface UserAddress {
  id: string;
  userClientId: string;
  label: string;
  details: string;
  lat?: number;
  lng?: number;
}

export interface ReloadRequest {
  id: string;
  userClientId: string;
  userName: string;
  amount: number;
  status: 'En attente' | 'Validé' | 'Refusé';
  created_at: string;
}

export interface User {
  id: string;
  clientId: string;
  name: string;
  email: string;
  pin: string;
  status: 'Standard' | 'Cercle';
  points: number;
  walletBalance: number;
  totalSpent: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number; 
  unit: string; 
  unitQuantity: number; 
  image: string;
  rating: number;
  category: string;
  stock: number;
  isCercleOnly: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  status: 'En préparation' | 'En livraison' | 'Livré';
  total: number;
  deliveryAddress: string;
  deliverySlot: string;
  paymentMethod?: 'Cash' | 'Card' | 'Wallet';
  customerName?: string;
  customerClientId?: string;
}
