'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getOrder } from '@/app/lib/api';
import { Check, X, Truck, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useCart } from '@/app/store/useCart';

// ---- Types matching backend OrderOut schema ----
interface OrderItemOut {
  id: string;
  name_snapshot: string;
  unit_price_cents: number;
  unit_price: number;
  quantity: number;
  line_total_cents: number;
  line_total: number;
  selections?: { id: string; name: string; quantity: number }[] | null;
}

interface OrderOut {
  id: string;
  order_number: string;
  status: string;
  fulfillment_type: string;     // "pickup" | "delivery"
  scheduled_date: string;       // YYYY-MM-DD
  scheduled_slot: string;       // "Morning" | "Afternoon" | "Evening"
  // Flat address
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  // Financials (dollars, not cents)
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  // Payment
  payment_method: string;
  payment_status: string;
  // Contact nested (OrderContactInfo uses camelCase fullName)
  contact: {
    fullName: string;
    email: string;
    phone: string;
    notes?: string | null;
  };
  items: OrderItemOut[];
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
        clearCart();
      } catch (err: any) {
        console.error('Failed to fetch order:', err);
        setError(err.response?.data?.detail || 'Unable to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  // ---- Error state ----
  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <X className="h-12 w-12 mx-auto text-red-500" />
        <h2 className="font-cinzel text-xl text-primary-deep">{error ?? 'Order not found.'}</h2>
        <button
          onClick={() => router.push('/')}
          className="btn-gold py-2 px-6 text-xs uppercase tracking-widest"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isDelivery = order.fulfillment_type === 'delivery';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* ─── Success Banner ─── */}
      <div className="flex items-center space-x-4 p-5 bg-white border border-border rounded-xl shadow-sm">
        <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-6 w-6 text-cream" />
        </span>
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-primary-deep font-extrabold">
            Order Confirmed!
          </h1>
          <p className="text-xs text-brown font-body mt-0.5">
            Thank you, <span className="font-semibold text-primary-deep">{order.contact.fullName}</span>. Your order{' '}
            <span className="font-cinzel font-bold text-primary">#{order.order_number}</span> has been received.
          </p>
        </div>
      </div>

      {/* ─── Two-column layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left — Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Fulfillment Card */}
          <div className="bg-white border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
              Fulfillment Details
            </h2>

            <div className="flex items-start space-x-3 text-xs">
              {isDelivery
                ? <Truck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                : <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />}
              <div>
                <span className="font-cinzel font-bold text-primary-deep block">
                  {isDelivery ? 'Local Delivery' : 'Contactless Pickup'}
                </span>
                {isDelivery && order.street && (
                  <span className="text-brown block mt-0.5">
                    {order.street}, {order.city}, {order.state} {order.zip_code}
                  </span>
                )}
                {!isDelivery && (
                  <span className="text-brown block mt-0.5">Houston, Texas 77055 – exact address in confirmation email.</span>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <Calendar className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-cinzel font-bold text-primary-deep block">Scheduled</span>
                <span className="text-brown">{order.scheduled_date} · {order.scheduled_slot}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <CreditCard className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-cinzel font-bold text-primary-deep block">Payment</span>
                <span className="text-brown capitalize">
                  {order.payment_method === 'cod' ? 'Cash on Delivery / Pickup' : 'Card'}{' '}
                  &mdash; <span className="text-primary-deep font-semibold capitalize">{order.payment_status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white border border-border rounded-xl p-5 space-y-2 text-xs">
            <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
              Contact Info
            </h2>
            <p><span className="text-brown">Name:</span> <span className="font-semibold text-primary-deep">{order.contact.fullName}</span></p>
            <p><span className="text-brown">Email:</span> <span className="text-primary-deep">{order.contact.email}</span></p>
            <p><span className="text-brown">Phone:</span> <span className="text-primary-deep">{order.contact.phone}</span></p>
            {order.contact.notes && (
              <p><span className="text-brown">Notes:</span> <span className="text-primary-deep">{order.contact.notes}</span></p>
            )}
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="bg-cream/40 border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-bold border-b border-border pb-2.5">
            Order Summary
          </h2>

          {/* Items */}
          <div className="divide-y divide-border/60 max-h-64 overflow-y-auto no-scrollbar">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <p className="font-cinzel font-semibold text-primary-deep leading-tight pr-2 flex-1">
                    {item.name_snapshot}
                  </p>
                  <span className="font-cinzel font-bold text-primary-deep flex-shrink-0">
                    ${item.line_total.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-brown">{item.quantity}x @ ${item.unit_price.toFixed(2)}</p>
                {item.selections && item.selections.length > 0 && (
                  <ul className="text-[10px] text-brown space-y-0.5 pl-2">
                    {item.selections.map((sel, i) => (
                      <li key={i}>– {sel.name} ×{sel.quantity}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-brown">Subtotal</span>
              <span className="font-cinzel font-bold text-primary-deep">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brown">Delivery</span>
              <span className="font-cinzel font-bold text-primary-deep">
                {isDelivery ? `$${order.delivery_fee.toFixed(2)}` : 'Free'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brown">Tax</span>
              <span className="font-cinzel font-bold text-primary-deep">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-cinzel font-bold text-primary-deep">Grand Total</span>
              <span className="font-cinzel text-base font-bold text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => router.push('/menu')}
          className="btn-gold py-2.5 px-8 text-xs uppercase tracking-widest"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => router.push('/')}
          className="py-2.5 px-8 text-xs uppercase tracking-widest font-cinzel font-semibold border border-border text-primary-deep rounded-lg hover:bg-cream/60 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
