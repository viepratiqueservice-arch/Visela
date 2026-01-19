
export enum Page {
  Auth = 'Auth',
  Home = 'Home',
  Cart = 'Cart',
  Orders = 'Orders',
  Profile = 'Profile',
  Market = 'Market',
  Admin = 'Admin',
  Cercle = 'Cercle',
  Subscription = 'Subscription'
}

export interface ReloadRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  status: 'En attente' | 'Validé' | 'Refusé';
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
  purchasePrice?: number; 
  profit?: number; 
  unit: string; 
  unitQuantity: number; 
  image: string;
  rating: number;
  category: string;
  deliveryTime: string;
  stock?: number;
  isCercleOnly?: boolean;
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

export interface Sector { id: string; name: string; }
export interface Zone { id: string; name: string; sectors: Sector[]; }
export interface Commune { id: string; name: string; zones: Zone[]; }
