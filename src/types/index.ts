export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  popular?: boolean;
  customizations?: {
    batter?: string[];
    size?: string[];
    cooking?: string[];
    sauce?: string[];
  };
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedCustomizations?: {
    batter?: string;
    size?: string;
    cooking?: string;
    sauce?: string;
  };
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Customizations {
  batter?: string;
  size?: string;
  cooking?: string;
  sauce?: string;
}

export type CategoryId = 'all' | 'popular' | 'fish' | 'sides' | 'seafood';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  count: number;
}