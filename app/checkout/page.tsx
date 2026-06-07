'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, MapPin, CreditCard, DollarSign, ArrowRight, ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import Image from 'next/image';

// Unified Validation Schema
const checkoutSchema = z.object({
  fulfillment: z.enum(['delivery', 'pickup']),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  slot: z.string().min(1, 'Time slot is required'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['card', 'cod']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.fulfillment === 'delivery') {
    if (!data.street) ctx.addIssue({ code: 'custom', message: 'Street address is required', path: ['street'] });
    if (!data.city) ctx.addIssue({ code: 'custom', message: 'City is required', path: ['city'] });
    if (!data.state) ctx.addIssue({ code: 'custom', message: 'State is required', path: ['state'] });
    if (!data.zip) ctx.addIssue({ code: 'custom', message: 'ZIP code is required', path: ['zip'] });
  }
  if (data.paymentMethod === 'card') {
    if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length < 16) {
      ctx.addIssue({ code: 'custom', message: 'Enter a valid 16-digit card number', path: ['cardNumber'] });
    }
    if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({ code: 'custom', message: 'Use MM/YY format', path: ['cardExpiry'] });
    }
    if (!data.cardCvc || data.cardCvc.length < 3) {
      ctx.addIssue({ code: 'custom', message: 'CVC must be at least 3 digits', path: ['cardCvc'] });
    }
  }
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    fulfillment,
    setFulfillmentType,
    getCartSubtotal,
    getDeliveryFee,
    getCartTotal,
    clearCart,
    addToast
  } = useCart();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subtotal details
  const subtotal = getCartSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getCartTotal();

  // Initialize Form with React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'all',
    defaultValues: {
      fulfillment: fulfillment,
      street: '',
      city: '',
      state: '',
      zip: '',
      date: '',
      slot: 'Afternoon',
      fullName: '',
      email: '',
      phone: '',
      notes: '',
      paymentMethod: 'cod',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    }
  });

  const watchedFulfillment = watch('fulfillment');
  const watchedPayment = watch('paymentMethod');

  // Tomorrow's date helper (ISO format)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Step transitions
  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ['fulfillment', 'date', 'slot'];
      if (watchedFulfillment === 'delivery') {
        fieldsToValidate.push('street', 'city', 'state', 'zip');
      }
    } else if (step === 2) {
      fieldsToValidate = ['fullName', 'email', 'phone'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      if (step === 1 && watchedFulfillment) {
        setFulfillmentType(watchedFulfillment);
      }
      setStep((prev) => prev + 1);
    } else {
      addToast('Please correct form errors before proceeding.', 'error');
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  // Form Submit (Final Place Order)
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);

    // Simulate placing order
    setTimeout(() => {
      const orderId = `MS-${Math.floor(100000 + Math.random() * 900000)}`;

      // Save order details to local storage so confirmation page can display them
      const orderDetails = {
        orderId,
        items: cartItems,
        subtotal,
        deliveryFee,
        total,
        fulfillment: data.fulfillment,
        address: data.fulfillment === 'delivery' ? {
          street: data.street,
          city: data.city,
          state: data.state,
          zip: data.zip
        } : null,
        scheduledDate: data.date,
        scheduledSlot: data.slot,
        contact: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          notes: data.notes
        },
        paymentMethod: data.paymentMethod
      };

      localStorage.setItem('murad_sweets_last_order', JSON.stringify(orderDetails));

      // Clear cart
      clearCart();
      setIsSubmitting(false);
      addToast('Order placed successfully!', 'success');
      router.push(`/order-confirmation/${orderId}`);
    }, 2000);
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
        <p className="text-xs text-brown mt-1">Provide your fulfillment and contact details below.</p>
      </div>

      {/* Progress Bar (1 -> 2 -> 3) */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-350 -z-10"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />

          {[
            { stepNum: 1, label: 'Fulfillment' },
            { stepNum: 2, label: 'Contact' },
            { stepNum: 3, label: 'Payment' }
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
        {/* Left Column: Checkout Wizard (Col-span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1: FULFILLMENT */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-cinzel text-sm uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
                  Fulfillment Choice
                </h2>

                {/* Toggle tab */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-cream/40 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('fulfillment', 'pickup');
                      setFulfillmentType('pickup');
                    }}
                    className={`py-3 text-xs font-cinzel uppercase font-semibold rounded-md flex items-center justify-center space-x-2 transition-all ${watchedFulfillment === 'pickup'
                        ? 'bg-primary text-cream shadow-sm'
                        : 'text-primary hover:bg-cream/70'
                      }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Contactless Pickup</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('fulfillment', 'delivery');
                      setFulfillmentType('delivery');
                    }}
                    className={`py-3 text-xs font-cinzel uppercase font-semibold rounded-md flex items-center justify-center space-x-2 transition-all ${watchedFulfillment === 'delivery'
                        ? 'bg-primary text-cream shadow-sm'
                        : 'text-primary hover:bg-cream/70'
                      }`}
                  >
                    <Truck className="h-4 w-4" />
                    <span>Local Delivery</span>
                  </button>
                </div>

                {/* Delivery Address fields */}
                {watchedFulfillment === 'delivery' && (
                  <div className="space-y-4 pt-2">
                    <h3 className="font-cinzel text-xs uppercase tracking-wider text-brown font-bold">Delivery Address</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Street Address</label>
                        <input
                          type="text"
                          {...register('street')}
                          className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep placeholder-brown/40 focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="123 Sweet Lane"
                        />
                        {errors.street && <span className="text-[10px] text-red-600 block mt-1">{errors.street.message}</span>}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1.5">
                          <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">City</label>
                          <input
                            type="text"
                            {...register('city')}
                            className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none"
                            placeholder="Brooklyn"
                          />
                          {errors.city && <span className="text-[10px] text-red-600 block mt-1">{errors.city.message}</span>}
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">State</label>
                          <input
                            type="text"
                            {...register('state')}
                            className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none"
                            placeholder="NY"
                          />
                          {errors.state && <span className="text-[10px] text-red-600 block mt-1">{errors.state.message}</span>}
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">ZIP Code</label>
                          <input
                            type="text"
                            {...register('zip')}
                            className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none"
                            placeholder="11218"
                          />
                          {errors.zip && <span className="text-[10px] text-red-600 block mt-1">{errors.zip.message}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pickup Info Banner */}
                {watchedFulfillment === 'pickup' && (
                  <div className="p-4 bg-blush/40 border border-border rounded-xl space-y-2">
                    <h3 className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-bold flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-accent" />
                      <span>Pickup Address</span>
                    </h3>
                    <p className="text-xs text-primary-deep leading-relaxed font-body">
                      Murad Sweets Kitchen: **Brooklyn, NY 11218** <br />
                      Pickup is completely contact-free. The exact house address and detailed collection instructions will be shared in your confirmation email and SMS once we review the order schedule.
                    </p>
                  </div>
                )}

                {/* Date & Time Picker */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-cinzel text-xs uppercase tracking-wider text-brown font-bold">Schedule Fulfillment</h3>
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
                </div>
              </div>
            )}

            {/* STEP 2: CONTACT DETAILS */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-cinzel text-sm uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
                  Contact Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Full Name</label>
                    <input
                      type="text"
                      {...register('fullName')}
                      className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none"
                      placeholder="Anisur Rahman"
                    />
                    {errors.fullName && <span className="text-[10px] text-red-600 block mt-1">{errors.fullName.message}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none"
                      placeholder="anis@example.com"
                    />
                    {errors.email && <span className="text-[10px] text-red-600 block mt-1">{errors.email.message}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none"
                      placeholder="(555) 019-9283"
                    />
                    {errors.phone && <span className="text-[10px] text-red-600 block mt-1">{errors.phone.message}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1.5">
                      Order Notes & Special Instructions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      {...register('notes')}
                      className="w-full text-xs bg-cream/20 border border-border rounded-md p-2.5 text-primary-deep focus:outline-none"
                      placeholder="Specify dietary warnings, custom box arrangement preferences, or pickup time specifics..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-cinzel text-sm uppercase tracking-wider text-primary font-bold border-b border-border pb-2.5">
                  Secure Payment Method
                </h2>

                {/* Selector */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-cream/40 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setValue('paymentMethod', 'cod')}
                    className={`py-3 text-xs font-cinzel uppercase font-semibold rounded-md flex items-center justify-center space-x-2 transition-all ${watchedPayment === 'cod'
                        ? 'bg-primary text-cream shadow-sm'
                        : 'text-primary hover:bg-cream/70'
                      }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Cash on Delivery (COD)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('paymentMethod', 'card')}
                    className={`py-3 text-xs font-cinzel uppercase font-semibold rounded-md flex items-center justify-center space-x-2 transition-all ${watchedPayment === 'card'
                        ? 'bg-primary text-cream shadow-sm'
                        : 'text-primary hover:bg-cream/70'
                      }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Credit / Debit Card</span>
                  </button>
                </div>

                {/* Card Fields (Mock Stripe Elements) */}
                {watchedPayment === 'card' && (
                  <div className="p-5 border border-border rounded-xl bg-cream/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2.5">
                      <span className="font-cinzel text-[11px] uppercase tracking-wider text-primary-deep font-bold flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-accent" />
                        <span>Stripe Secured Card Information</span>
                      </span>
                      <Image
                        src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100&auto=format&fit=crop&q=60"
                        alt="Stripe logo placeholder"
                        width={60}
                        height={20}
                        className="opacity-50"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          {...register('cardNumber')}
                          onChange={(e) => {
                            // format card with spaces
                            const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const matches = value.match(/\d{4,16}/g);
                            const match = (matches && matches[0]) || '';
                            const parts = [];
                            for (let i = 0, len = match.length; i < len; i += 4) {
                              parts.push(match.substring(i, i + 4));
                            }
                            setValue('cardNumber', parts.length > 0 ? parts.join(' ') : value);
                          }}
                          className="w-full text-xs bg-white border border-border rounded p-2.5 text-primary-deep focus:outline-none"
                          placeholder="4242 4242 4242 4242"
                        />
                        {errors.cardNumber && <span className="text-[10px] text-red-600 block mt-1">{errors.cardNumber.message}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1">Expiry Date</label>
                          <input
                            type="text"
                            maxLength={5}
                            {...register('cardExpiry')}
                            onChange={(e) => {
                              // format MM/YY
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) {
                                val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                              }
                              setValue('cardExpiry', val);
                            }}
                            className="w-full text-xs bg-white border border-border rounded p-2.5 text-primary-deep focus:outline-none"
                            placeholder="MM/YY"
                          />
                          {errors.cardExpiry && <span className="text-[10px] text-red-600 block mt-1">{errors.cardExpiry.message}</span>}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-cinzel font-semibold text-brown mb-1">CVC / CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            {...register('cardCvc')}
                            className="w-full text-xs bg-white border border-border rounded p-2.5 text-primary-deep focus:outline-none"
                            placeholder="123"
                          />
                          {errors.cardCvc && <span className="text-[10px] text-red-600 block mt-1">{errors.cardCvc.message}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* COD Details */}
                {watchedPayment === 'cod' && (
                  <div className="p-4 bg-blush/40 border border-border rounded-xl flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-primary-deep uppercase">Pay on Delivery/Pickup</h4>
                      <p className="text-[11px] text-brown leading-relaxed font-body mt-0.5">
                        No immediate card payment is required. You can pay using cash, Zelle, or Venmo upon collecting your box or when we deliver the order.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-border flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center text-xs font-cinzel font-bold text-brown hover:text-primary transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-gold py-2.5 px-6 text-xs uppercase tracking-widest flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-gold py-3 px-8 text-xs uppercase tracking-widest flex items-center space-x-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  <span>{isSubmitting ? 'Processing Order...' : 'Place Order'}</span>
                  {!isSubmitting && <ArrowRight className="h-4 w-4 text-accent" />}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="bg-cream/40 border border-border rounded-xl p-5 sm:p-6 space-y-4">
          <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-bold border-b border-border pb-2.5">
            Order Items
          </h2>

          <div className="divide-y divide-border/60 max-h-80 overflow-y-auto no-scrollbar">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="py-3 flex space-x-3 items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-cinzel font-semibold text-primary-deep truncate">{item.name}</p>
                  <p className="text-[10px] text-brown font-body">
                    {item.quantity}x {item.unit || 'per unit'}
                  </p>
                </div>
                <span className="font-cinzel font-bold text-primary-deep flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-brown">Subtotal</span>
              <span className="font-cinzel font-bold text-primary-deep">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-brown">Fulfillment ({watchedFulfillment})</span>
              <span className="font-cinzel font-bold text-primary-deep capitalize">
                {watchedFulfillment === 'delivery' ? `$${deliveryFee.toFixed(2)}` : 'Free'}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-cinzel font-bold text-primary-deep">Grand Total</span>
              <span className="font-cinzel text-base text-primary font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
