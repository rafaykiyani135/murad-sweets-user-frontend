import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/app/data/products';

export type MixMatchBox = {
  size: 3 | 6 | 9;
  price: 5 | 10 | 15;
  selectedItems: { id: string; name: string; quantity: number }[]; // array of sweets selected in the box
};

export type AssortedBox = {
  size: 3 | 6 | 9;
  price: number;
  selectedItems: { name: string; color: string }[];
};

export type CartItem = {
  cartItemId: string; // unique identifier (productId + timestamp/options for mixMatch)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  unit?: string;
  mixMatch?: MixMatchBox;
  assortedBox?: AssortedBox;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type ContactInfo = {
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
};

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

interface CartState {
  // Cart Items
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // UI States
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMixMatchOpen: boolean;
  mixMatchProduct: Product | null;
  openMixMatch: (product: Product) => void;
  closeMixMatch: () => void;
  isCollectionModalOpen: boolean;
  collectionCategory: Product['category'] | null;
  openCollectionModal: (category: Product['category']) => void;
  closeCollectionModal: () => void;
  
  // Toast notifications
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Fulfillment details
  fulfillment: 'delivery' | 'pickup';
  address?: Address;
  scheduledDate: string; // ISO date string
  scheduledSlot: string; // e.g. "Morning", "Afternoon", "Evening"
  contact?: ContactInfo;
  paymentMethod: 'card' | 'cod';
  
  setFulfillmentType: (type: 'delivery' | 'pickup') => void;
  setAddress: (address: Address) => void;
  setSchedule: (date: string, slot: string) => void;
  setContactInfo: (contact: ContactInfo) => void;
  setPaymentMethod: (method: 'card' | 'cod') => void;
  
  // Helper calculations
  getCartSubtotal: () => number;
  getCartCount: () => number;
  getDeliveryFee: () => number;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial States
      cartItems: [],
      isCartOpen: false,
      isMixMatchOpen: false,
      mixMatchProduct: null,
      isCollectionModalOpen: false,
      collectionCategory: null,
      toasts: [],
      fulfillment: 'pickup',
      scheduledDate: '',
      scheduledSlot: '',
      paymentMethod: 'cod',
      
      // Cart Actions
      addToCart: (item) => {
        const cartItems = get().cartItems;
        // Check if standard item already exists
        if (!item.mixMatch && !item.assortedBox) {
          const existingItemIndex = cartItems.findIndex(
            (i) => i.productId === item.productId && !i.mixMatch && !i.assortedBox
          );
          
          if (existingItemIndex > -1) {
            const updatedItems = [...cartItems];
            updatedItems[existingItemIndex].quantity += item.quantity;
            set({ cartItems: updatedItems });
            get().addToast(`Updated ${item.name} quantity in cart`, 'success');
            return;
          }
        }
        
        // Generate unique cart item ID
        const cartItemId = item.mixMatch || item.assortedBox
          ? `${item.productId}-${Date.now()}` 
          : item.productId;
          
        set({
          cartItems: [...cartItems, { ...item, cartItemId }]
        });
        
        get().addToast(`Added ${item.name} to cart`, 'success');
      },
      
      removeFromCart: (cartItemId) => {
        const itemToRemove = get().cartItems.find((i) => i.cartItemId === cartItemId);
        set({
          cartItems: get().cartItems.filter((i) => i.cartItemId !== cartItemId)
        });
        if (itemToRemove) {
          get().addToast(`Removed ${itemToRemove.name} from cart`, 'info');
        }
      },
      
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set({
          cartItems: get().cartItems.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => {
        set({ cartItems: [] });
      },
      
      // UI Drawer Actions
      setCartOpen: (open) => set({ isCartOpen: open }),
      openMixMatch: (product) => set({ isMixMatchOpen: true, mixMatchProduct: product }),
      closeMixMatch: () => set({ isMixMatchOpen: false, mixMatchProduct: null }),
      openCollectionModal: (category) => set({ isCollectionModalOpen: true, collectionCategory: category }),
      closeCollectionModal: () => set({ isCollectionModalOpen: false, collectionCategory: null }),
      
      // Toast Actions
      addToast: (message, type = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }]
        }));
        
        // Auto-dismiss after 2 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 2000);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      },
      
      // Fulfillment Actions
      setFulfillmentType: (fulfillment) => set({ fulfillment }),
      setAddress: (address) => set({ address }),
      setSchedule: (scheduledDate, scheduledSlot) => set({ scheduledDate, scheduledSlot }),
      setContactInfo: (contact) => set({ contact }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      
      // Calculations
      getCartSubtotal: () => {
        return get().cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        return get().cartItems.reduce((acc, item) => acc + item.quantity, 0);
      },
      getDeliveryFee: () => {
        // Flat fee $5 for delivery, $0 for pickup
        return get().fulfillment === 'delivery' ? 5 : 0;
      },
      getCartTotal: () => {
        return get().getCartSubtotal() + get().getDeliveryFee();
      }
    }),
    {
      name: 'murad-sweets-cart',
      // skip hydration issues by handling client state selectively, or letting next handle it
      partialize: (state) => ({
        cartItems: state.cartItems,
        fulfillment: state.fulfillment,
        address: state.address,
        scheduledDate: state.scheduledDate,
        scheduledSlot: state.scheduledSlot,
        contact: state.contact,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);
