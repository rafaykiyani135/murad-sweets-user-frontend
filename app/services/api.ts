const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchProducts(category?: string, query?: string) {
  let url = `${API_URL}/products`;
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (query) params.append('q', query);
  
  const searchStr = params.toString();
  if (searchStr) {
    url += `?${searchStr}`;
  }

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductBySlug(slug: string) {
  const res = await fetch(`${API_URL}/products/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product details');
  return res.json();
}

export async function getCartQuote(payload: {
  fulfillment: string;
  zip?: string;
  items: any[];
}) {
  const res = await fetch(`${API_URL}/cart/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to calculate quote');
  }
  return res.json();
}

export async function createOrder(payload: any) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit order');
  }
  return res.json();
}

export async function fetchOrderDetails(orderNumber: string) {
  const res = await fetch(`${API_URL}/orders/${orderNumber}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

export async function submitContactInquiry(payload: {
  fullName: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}) {
  const res = await fetch(`${API_URL}/contact-inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to send message');
  }
  return res.json();
}
