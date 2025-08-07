// Strict literal types for better type safety
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';
export type MenuCategory = 'fish' | 'sides' | 'seafood' | 'popular';

// Enhanced MenuItem with stricter types
export interface MenuItem {
  id: string;
  name: string;
  price: number; // In cents for precision
  category: MenuCategory;
  description: string;
  image: string;
  popular?: boolean;
  available?: boolean; // Track inventory status
  customizations?: {
    batter?: readonly string[];
    size?: readonly string[];
    cooking?: readonly string[];
    sauce?: readonly string[];
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

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: readonly CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  estimatedReady: Date | null;
  completedAt: Date | null;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: readonly CartItem[];
  total: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

// Admin specific types
export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  averageOrderValue: number;
}

export interface BusinessHours {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isOpen: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastUpdated: Date;
}

// Form validation types
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export interface FormState<T> {
  values: T;
  errors: ValidationErrors<T>;
  isSubmitting: boolean;
  isDirty: boolean;
}