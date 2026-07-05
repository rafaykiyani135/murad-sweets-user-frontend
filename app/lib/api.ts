import axios from 'axios';
import type { CartItem } from '@/app/store/cartStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────────────────────
// Cart item shape that the backend CartItemSchema expects.
// Do NOT include price or name_snapshot — the backend recalculates
// everything from the database.
// ─────────────────────────────────────────────────────────────
function toCartItemSchema(item: CartItem) {
  return {
    productId: item.productId,
    quantity: item.quantity,
    name: item.name,
    // Include box details only when they exist
    ...(item.mixMatch ? { mixMatch: item.mixMatch } : {}),
    ...(item.assortedBox ? { assortedBox: item.assortedBox } : {}),
  };
}

// ─── Public Catalog ───────────────────────────────────────────
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getProducts = async (categorySlug?: string, query?: string) => {
  const params = new URLSearchParams();
  if (categorySlug) params.append('category', categorySlug);
  if (query) params.append('q', query);
  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};

export const getStoreSettings = async () => {
  const response = await api.get('/store/settings');
  return response.data;
};

// ─── Cart Quote ───────────────────────────────────────────────
// Sends items in CartItemSchema format so the backend can
// recalculate totals server-side from DB prices.
export const getCartQuote = async (
  cartItems: CartItem[],
  fulfillmentType: string,
  zipCode: string = ''
) => {
  const payload = {
    fulfillment: fulfillmentType,
    zip: zipCode || undefined,
    items: cartItems.map(toCartItemSchema),
  };
  const response = await api.post('/cart/quote', payload);
  return response.data;
};

// ─── Orders ──────────────────────────────────────────────────
// Sends flat contact + schedule fields (matches backend OrderCreate schema).
// Items use the same CartItemSchema shape — backend re-prices from DB.
export const createOrder = async (
  cartItems: CartItem[],
  formData: {
    fulfillment: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    date: string;
    slot: string;
    fullName: string;
    email: string;
    phone: string;
    notes?: string;
    paymentMethod: string;
    deliveryFeeCents?: number;
  }
) => {
  const payload = {
    fulfillment: formData.fulfillment,
    // Address — only include for delivery
    ...(formData.fulfillment === 'delivery' ? {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
    } : {}),
    date: formData.date,
    slot: formData.slot,
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    notes: formData.notes || '',
    paymentMethod: formData.paymentMethod,
    deliveryFeeCents: formData.deliveryFeeCents || 0,
    items: cartItems.map(toCartItemSchema),
  };
  const response = await api.post('/orders', payload);
  return response.data;
};

export const getOrder = async (orderNumber: string) => {
  const response = await api.get(`/orders/${orderNumber}`);
  return response.data;
};

// ─── Contact Inquiries ────────────────────────────────────────
export const submitInquiry = async (payload: {
  fullName: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}) => {
  const response = await api.post('/contact-inquiries', payload);
  return response.data;
};
