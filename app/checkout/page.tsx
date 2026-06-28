'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Truck, MapPin, CreditCard, DollarSign, ArrowRight, ArrowLeft,
  ShoppingBag, Check, Loader2, Edit2
} from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { useFulfillmentStore } from '@/app/store/fulfillmentStore';
import { getCartQuote, createOrder } from '@/app/lib/api';
import Image from 'next/image';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

// ─── Validation Schema (simplified — address is now pre-set by fulfillment store) ─
const checkoutSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  slot: z.string().min(1, 'Time slot is required'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['card', 'cod']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, getCartSubtotal, clearCart, addToast } = useCart();

  // ── Fulfillment store (single source of truth) ──
  const {
    orderType,
    address,
    deliveryFeeCents,
    drivingDistanceMiles,
    openModal,
    getDeliveryFeeDisplay,
  } = useFulfillmentStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quote, setQuote] = useState<{
    subtotal_cents: number;
    delivery_fee_cents: number;
    tax_cents: number;
    total_cents: number;
  } | null>(null);
  const [pendingPayment, setPendingPayment] = useState<{ clientSecret: string; orderNumber: string } | null>(null);

  // ── Computed totals (prefer server quote, fall back to local) ──
  const subtotal = quote ? quote.subtotal_cents / 100 : getCartSubtotal();
  const deliveryFee = deliveryFeeCents !== null ? deliveryFeeCents / 100 : 0;
  const total = subtotal + (orderType === 'delivery' ? deliveryFee : 0) + (quote ? quote.tax_cents / 100 : 0);

  // ── Form ──
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'all',
    defaultValues: {
      date: '',
      slot: 'Afternoon',
      fullName: '',
      email: '',
      phone: '',
      notes: '',
      paymentMethod: 'cod',
    },
  });

  const watchedPayment = watch('paymentMethod');

  // ── Fetch server quote once on mount ──
  useEffect(() => {
    if (cartItems.length === 0) return;
    const fetchQuote = async () => {
      setIsQuoting(true);
      try {
        const zip = orderType === 'delivery' && address ? address.match(/\d{5}/)?.[0] || '' : '';
        const q = await getCartQuote(cartItems, orderType || 'pickup', zip);
        setQuote(q);
      } catch (err) {
        console.error('Quote fetch failed', err);
      } finally {
        setIsQuoting(false);
      }
    };
    fetchQuote();
  }, [cartItems, orderType, address]);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleNextStep = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ['date', 'slot'];
    else if (step === 2) fields = ['fullName', 'email', 'phone'];
    const valid = await trigger(fields);
    if (valid) setStep((p) => p + 1);
    else addToast('Please correct form errors before proceeding.', 'error');
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (step !== 3) {
      handleNextStep();
      return;
    }

    if (data.paymentMethod === 'card' && !stripe) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Build address parts from the fulfillment store's saved address string
      const addressParts = address ? address.split(',') : [];
      const street = addressParts[0]?.trim() || '';
      const city = addressParts[1]?.trim() || '';
      const stateZip = addressParts[2]?.trim().split(' ') || [];
      const state = stateZip[0] || '';
      const zip = stateZip[1] || '';

      let clientSecret = pendingPayment?.clientSecret;
      let orderNumber = pendingPayment?.orderNumber;

      // Only create a new order if we haven't already created one for this session
      if (!clientSecret || !orderNumber) {
        const res = await createOrder(cartItems, {
          fulfillment: orderType || 'pickup',
          street,
          city,
          state,
          zip,
          date: data.date,
          slot: data.slot,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          notes: data.notes || '',
          paymentMethod: data.paymentMethod,
          deliveryFeeCents: orderType === 'delivery' ? deliveryFeeCents || 0 : 0,
        });

        clientSecret = res.client_secret;
        orderNumber = res.order_number || res.id;

        if (data.paymentMethod === 'card' && clientSecret && orderNumber) {
          setPendingPayment({ clientSecret, orderNumber });
        }
      }

      if (data.paymentMethod === 'card' && clientSecret) {
        const cardElement = elements?.getElement(CardElement);
        if (!cardElement) throw new Error("Stripe not initialized");

        const { error, paymentIntent } = await stripe!.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: data.fullName,
              email: data.email,
            }
          }
        });

        if (error) {
          throw new Error(error.message); // This throws so we don't redirect, but we keep the pendingPayment state
        }
      }

      // Success
      setPendingPayment(null);
      clearCart();
      addToast('Order placed successfully!', 'success');
      router.push(`/order-confirmation/${orderNumber || ''}`);
    } catch (err: any) {
      addToast(err.response?.data?.detail || err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <ShoppingBag className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-heading text-xl text-primary-deep font-bold">Your Cart is Empty</h2>
        <button onClick={() => router.push('/menu')} className="btn-gold py-2 px-6 text-xs uppercase tracking-widest">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-border pb-4">
        <h1 className="font-heading text-3xl text-primary font-extrabold tracking-tight">Checkout</h1>
        <p className="text-xs text-brown mt-1">Review your order and provide contact details.</p>
      </div>

      {/* Fulfillment Summary Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-cream/40">
        <div className="flex items-center gap-3">
          {orderType === 'delivery' ? (
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 border border-accent/25">
              <Truck className="h-4 w-4 text-accent" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/25">
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
          )}
          <div>
            <p className="font-cinzel text-xs font-bold text-primary-deep uppercase tracking-wider">
              {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
            </p>
            <p className="text-xs text-brown font-body mt-0.5">
              {orderType === 'delivery' && address
                ? address
                : '11920 S Texas 6, Unit 1280, Sugar Land, TX 77498'}
            </p>
            {orderType === 'delivery' && drivingDistanceMiles !== null && (
              <p className="text-[10px] text-brown/70 font-body">
                {drivingDistanceMiles.toFixed(1)} miles · Delivery fee: {getDeliveryFeeDisplay()}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white hover:border-primary/40 transition-colors text-xs font-cinzel font-semibold text-primary-deep uppercase tracking-wider"
        >
          <Edit2 className="h-3 w-3" />
          Change
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-350 -z-10"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {[
            { stepNum: 1, label: 'Schedule' },
            { stepNum: 2, label: 'Contact' },
            { stepNum: 3, label: 'Payment' },
          ].map((s) => {
            const isCompleted = step > s.stepNum;
            const isActive = step === s.stepNum;
            return (
              <div key={s.stepNum} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-xs font-bold border-2 transition-all duration-300 ${isCompleted
                    ? 'bg-primary border-primary text-white'
                    : isActive
                      ? 'bg-cream border-primary text-primary'
                      : 'bg-white border-border text-brown'
                    }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : s.stepNum}
                </div>
                <span className={`text-[10px] uppercase font-cinzel font-semibold tracking-wider ${isActive ? 'text-primary' : 'text-brown'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Wizard */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6 sm:p-8 shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                e.preventDefault();
              }
            }}
            className="space-y-6"
          >
            {/* STEP 1: SCHEDULE */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-cinzel text-sm uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
                  Schedule Fulfillment
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Preferred Date</label>
                    <input
                      type="date"
                      min={getMinDate()}
                      {...register('date')}
                      className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    />
                    {errors.date && <span className="text-[10px] text-red-600 block mt-1">{errors.date.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Preferred Time Slot</label>
                    <select
                      {...register('slot')}
                      className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none"
                    >
                      <option value="Morning">Morning (10:00 AM – 1:00 PM)</option>
                      <option value="Afternoon">Afternoon (1:00 PM – 5:00 PM)</option>
                      <option value="Evening">Evening (5:00 PM – 8:00 PM)</option>
                    </select>
                    {errors.slot && <span className="text-[10px] text-red-600 block mt-1">{errors.slot.message}</span>}
                  </div>
                </div>

                {/* Pickup info banner */}
                {orderType === 'pickup' && (
                  <div className="p-4 bg-blush/40 border border-border rounded-xl space-y-2">
                    <h3 className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-bold flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-accent" />
                      Pickup Address
                    </h3>
                    <p className="text-xs text-primary-deep leading-relaxed font-body">
                      <strong>Murad Sweets:</strong> 11920 S Texas 6, Unit 1280, Sugar Land, TX 77498<br />
                      Pickup is completely contact-free. Exact instructions will be shared in your confirmation email.
                    </p>
                  </div>
                )}

                {/* Delivery confirmation banner */}
                {orderType === 'delivery' && address && (
                  <div className="p-4 bg-blush/40 border border-border rounded-xl space-y-1">
                    <h3 className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-bold flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-accent" />
                      Delivering To
                    </h3>
                    <p className="text-xs text-primary-deep font-body">{address}</p>
                    {drivingDistanceMiles !== null && (
                      <p className="text-[10px] text-brown font-body">
                        Distance: {drivingDistanceMiles.toFixed(1)} miles · Fee: {getDeliveryFeeDisplay()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: CONTACT */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-cinzel text-sm uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Full Name</label>
                    <input type="text" {...register('fullName')} className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none" placeholder="Anisur Rahman" />
                    {errors.fullName && <span className="text-[10px] text-red-600 block mt-1">{errors.fullName.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Email Address</label>
                    <input type="email" {...register('email')} className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none" placeholder="anis@example.com" />
                    {errors.email && <span className="text-[10px] text-red-600 block mt-1">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Phone Number</label>
                    <input type="tel" {...register('phone')} className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none" placeholder="(346) 368-4831" />
                    {errors.phone && <span className="text-[10px] text-red-600 block mt-1">{errors.phone.message}</span>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Order Notes (Optional)</label>
                    <textarea rows={3} {...register('notes')} className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none" placeholder="Dietary warnings, custom preferences..." />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-cinzel text-sm uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
                  Secure Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3 p-1 bg-cream/40 rounded-lg border border-border">
                  <button type="button" onClick={() => setValue('paymentMethod', 'cod')}
                    className={`py-3 text-xs font-cinzel uppercase font-semibold rounded-md flex items-center justify-center space-x-2 transition-all ${watchedPayment === 'cod' ? 'bg-primary text-cream shadow-sm' : 'text-primary hover:bg-cream/70'}`}>
                    <DollarSign className="h-4 w-4" /><span>Cash on Delivery</span>
                  </button>
                  <button type="button" onClick={() => setValue('paymentMethod', 'card')}
                    className={`py-3 text-xs font-cinzel uppercase font-semibold rounded-md flex items-center justify-center space-x-2 transition-all ${watchedPayment === 'card' ? 'bg-primary text-cream shadow-sm' : 'text-primary hover:bg-cream/70'}`}>
                    <CreditCard className="h-4 w-4" /><span>Credit / Debit Card</span>
                  </button>
                </div>

                {watchedPayment === 'card' && (
                  <div className="p-5 border border-border rounded-xl bg-cream/10 space-y-4">
                    <div className="flex items-center gap-2 border-b border-border pb-2.5">
                      <CreditCard className="h-4 w-4 text-accent" />
                      <span className="font-cinzel text-[11px] uppercase tracking-wider text-primary-deep font-bold">Stripe Secured Card Information</span>
                    </div>
                    <div className="bg-white border border-border rounded-md p-3.5">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '14px',
                              color: '#342318',
                              '::placeholder': {
                                color: '#a89f91',
                              },
                              fontFamily: 'Inter, system-ui, sans-serif'
                            },
                            invalid: {
                              color: '#dc2626',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}

                {watchedPayment === 'cod' && (
                  <div className="p-4 bg-blush/40 border border-border rounded-xl flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-primary-deep uppercase">Pay on Delivery/Pickup</h4>
                      <p className="text-[11px] text-brown leading-relaxed font-body mt-0.5">
                        No immediate card payment required. Pay using cash, Zelle, or Venmo on collection or delivery.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="pt-6 border-t border-border flex justify-between items-center">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((p) => p - 1)} className="inline-flex items-center text-xs font-cinzel font-bold text-brown hover:text-primary transition-all">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />Previous
                </button>
              ) : <div />}
              {step < 3 ? (
                <button type="button" onClick={handleNextStep} className="btn-gold py-2.5 px-6 text-xs uppercase tracking-widest flex items-center space-x-2">
                  <span>Continue</span><ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}
                  className={`btn-gold py-3 px-8 text-xs uppercase tracking-widest flex items-center space-x-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span>{isSubmitting ? 'Processing...' : 'Place Order'}</span>
                  {!isSubmitting && <ArrowRight className="h-4 w-4 text-accent" />}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-cream/40 border border-border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-bold">Order Summary</h2>
            {isQuoting && <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />}
          </div>

          <div className="divide-y divide-border/60 max-h-72 overflow-y-auto no-scrollbar">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="py-3 flex space-x-3 items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-cinzel font-semibold text-primary-deep truncate">{item.name}</p>
                  <p className="text-[10px] text-brown font-body">{item.quantity}x {item.unit || 'per unit'}</p>
                </div>
                <span className="font-cinzel font-bold text-primary-deep flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-brown">Subtotal</span>
              <span className="font-cinzel font-bold text-primary-deep">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brown">Delivery Fee</span>
              <span className={`font-cinzel font-bold ${orderType === 'delivery' && deliveryFee > 0 ? 'text-primary-deep' : 'text-emerald-600'}`}>
                {getDeliveryFeeDisplay()}
              </span>
            </div>
            {/* {quote && (
              <div className="flex justify-between items-center">
                <span className="text-brown">Tax</span>
                <span className="font-cinzel font-bold text-primary-deep">${(quote.tax_cents / 100).toFixed(2)}</span>
              </div>
            )} */}
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-cinzel font-bold text-primary-deep">Grand Total</span>
              <span className="font-cinzel text-base text-primary font-bold">
                {isQuoting ? '—' : `$${total.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
