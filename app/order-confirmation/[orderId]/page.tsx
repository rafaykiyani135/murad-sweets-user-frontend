'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, Calendar, Clock, MapPin, Phone, CreditCard, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

type OrderDetails = {
  orderId: string;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  fulfillment: 'delivery' | 'pickup';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  scheduledDate: string;
  scheduledSlot: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    notes?: string;
  };
  paymentMethod: 'card' | 'cod';
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read details of the order from local storage
    const cachedOrder = localStorage.getItem('murad_sweets_last_order');
    if (cachedOrder) {
      try {
        const parsed = JSON.parse(cachedOrder);
        // Verify orderId matches param or fallback
        if (parsed.orderId === orderId) {
          setOrder(parsed);
        } else {
          setOrder(parsed); // use cached anyway as fallback
        }
      } catch (err) {
        console.error('Error parsing cached order', err);
      }
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-cinzel text-xs uppercase tracking-wider text-brown">Retrieving Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="font-heading text-2xl text-primary font-bold">Receipt Not Found</h2>
        <p className="text-sm text-brown font-body">
          We couldn&apos;t load the order details. This might happen if you refresh the page or clear your browser data.
        </p>
        <button onClick={() => router.push('/')} className="btn-gold py-2 px-6 text-xs uppercase tracking-widest">
          Go to Home
        </button>
      </div>
    );
  }

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Card Header */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
        {/* Animated Check */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto border-2 border-green-500/20"
        >
          <CheckCircle2 className="h-10 w-10 stroke-[1.5]" />
        </motion.div>

        <div className="space-y-1">
          <span className="font-cinzel text-[10px] sm:text-xs text-accent font-bold uppercase tracking-widest">Order Placed Successfully!</span>
          <h1 className="font-heading text-2xl sm:text-3xl text-primary font-extrabold">Thank You For Your Order</h1>
          <p className="text-xs text-brown font-body max-w-md mx-auto pt-1 leading-relaxed">
            We have received your request. **We will contact you via email or phone within 24 hours to confirm fulfillment details and coordinate delivery/pickup.**
          </p>
        </div>

        <div className="inline-block bg-cream/40 border border-border px-4 py-2 rounded-lg">
          <span className="text-[10px] text-brown uppercase font-cinzel font-semibold tracking-wider">Order ID:</span>
          <span className="font-cinzel font-bold text-primary-deep text-sm ml-2">{order.orderId}</span>
        </div>
      </div>

      {/* Recap details card */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Fulfillment Schedule */}
        <div className="space-y-5">
          <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
            Fulfillment Details
          </h2>

          <div className="space-y-4 text-xs font-body">
            {/* Type */}
            <div className="flex items-start space-x-3">
              <ShoppingBag className="h-5 w-5 text-accent flex-shrink-0" />
              <div>
                <span className="font-bold text-primary-deep uppercase font-cinzel text-[10px] tracking-wider block">Fulfillment Type</span>
                <span className="text-primary-deep capitalize font-semibold">{order.fulfillment}</span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
              <div>
                <span className="font-bold text-primary-deep uppercase font-cinzel text-[10px] tracking-wider block">Scheduled Date</span>
                <span className="text-primary-deep font-semibold">{formatDate(order.scheduledDate)}</span>
              </div>
            </div>

            {/* Slot */}
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-accent flex-shrink-0" />
              <div>
                <span className="font-bold text-primary-deep uppercase font-cinzel text-[10px] tracking-wider block">Preferred Time Slot</span>
                <span className="text-primary-deep font-semibold">{order.scheduledSlot}</span>
              </div>
            </div>

            {/* Delivery address or Pickup coordinates */}
            {order.fulfillment === 'delivery' && order.address ? (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <span className="font-bold text-primary-deep uppercase font-cinzel text-[10px] tracking-wider block">Delivery Address</span>
                  <span className="text-primary-deep">
                    {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <span className="font-bold text-primary-deep uppercase font-cinzel text-[10px] tracking-wider block">Pickup Location</span>
                  <span className="text-primary-deep">
                    Brooklyn, NY 11218 <br />
                    <span className="text-[10px] text-brown font-semibold leading-relaxed block mt-1">
                      *Exact door address and pickup instructions will be text/emailed as soon as the order is approved.
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Info & Payment */}
        <div className="space-y-5">
          <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
            Customer & Payment Recap
          </h2>

          <div className="space-y-4 text-xs font-body">
            {/* Contact */}
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-accent flex-shrink-0" />
              <div>
                <span className="font-bold text-primary-deep uppercase font-cinzel text-[10px] tracking-wider block">Contact Information</span>
                <span className="text-primary-deep block font-semibold">{order.contact.fullName}</span>
                <span className="text-brown block">{order.contact.email}</span>
                <span className="text-brown block">{order.contact.phone}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-start space-x-3">
              {order.paymentMethod === 'card' ? (
                <>
                  <CreditCard className="h-5 w-5 text-accent flex-shrink-0" />
                  <div>
                    <span className="font-bold text-primary-deep uppercase font-cinzel text-[10px] tracking-wider block">Payment Method</span>
                    <span className="text-primary-deep font-semibold">Credit/Debit Card (Stripe Mock)</span>
                  </div>
                </>
              ) : (
                <>
                  <DollarSign className="h-5 w-5 text-accent flex-shrink-0" />
                  <div>
                    <span className="font-bold text-primary-deep uppercase font-cinzel text-[10px] tracking-wider block">Payment Method</span>
                    <span className="text-primary-deep font-semibold">Cash on Delivery (COD)</span>
                  </div>
                </>
              )}
            </div>

            {/* Special notes */}
            {order.contact.notes && (
              <div className="bg-cream/40 p-3 rounded-lg border border-border text-[11px] text-brown">
                <span className="font-bold block mb-0.5 uppercase tracking-wider font-cinzel text-[9px]">Special Instructions:</span>
                <p className="leading-relaxed font-body">{order.contact.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Item Summary Table */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
          Order Summary
        </h2>

        <div className="divide-y divide-border/60">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3.5 flex justify-between items-start text-xs font-body">
              <div>
                <p className="font-cinzel font-bold text-primary-deep">{item.name}</p>
                <p className="text-[10px] text-brown font-semibold mt-0.5">
                  Quantity: {item.quantity} {item.unit ? `(${item.unit})` : ''}
                </p>
                {item.mixMatch && (
                  <div className="mt-1 bg-blush/30 border border-border/40 rounded p-1.5 text-[9px] text-brown max-w-md">
                    <ul className="list-disc list-inside space-y-0.5">
                      {item.mixMatch.selectedItems.map((selected: any, i: number) => (
                        <li key={i}>
                          {selected.quantity}x {selected.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="font-cinzel font-bold text-primary-deep">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border pt-4 text-xs font-body space-y-2 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span className="text-brown">Subtotal</span>
            <span className="font-cinzel font-bold text-primary-deep">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brown">Fulfillment ({order.fulfillment})</span>
            <span className="font-cinzel font-bold text-primary-deep">
              {order.fulfillment === 'delivery' ? `$${order.deliveryFee.toFixed(2)}` : 'Free'}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="font-cinzel font-bold text-primary">Grand Total</span>
            <span className="font-cinzel text-base text-primary font-bold">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center">
        <Link href="/menu" className="btn-gold py-3 px-8 text-xs uppercase tracking-widest inline-block shadow-md">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
