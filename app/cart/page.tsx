'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { motion } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    fulfillment,
    getDeliveryFee,
    getCartTotal
  } = useCart();

  const subtotal = getCartSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center text-primary mx-auto">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl text-primary-deep font-bold">Your Cart is Empty</h2>
          <p className="text-sm text-brown font-body max-w-sm mx-auto">
            Build your personalized box of traditional sweets or choose from our specialty items to get started!
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex btn-gold py-3 px-8 text-xs uppercase tracking-widest text-white shadow-md"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-heading text-3xl text-primary font-extrabold tracking-tight">Your Shopping Cart</h1>
        <p className="text-xs text-brown mt-1">Review your sweet selection before proceeding to secure checkout.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart items list (Col-span 2) */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <motion.div
              layout
              key={item.cartItemId}
              className="p-4 bg-white rounded-xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative group"
            >
              {/* Product Info & Image */}
              <div className="flex gap-4 items-start sm:items-center">
                <div className="w-20 h-20 bg-blush rounded-lg overflow-hidden flex-shrink-0 relative border border-border">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-primary/40 font-subheading">
                      Sweets
                    </div>
                  )}
                </div>

                <div className="space-y-1 max-w-md">
                  <h3 className="font-cinzel text-sm sm:text-base text-primary-deep font-bold leading-tight">
                    {item.name}
                  </h3>

                  {item.unit && (
                    <p className="text-xs text-brown font-body font-semibold">
                      {item.unit}
                    </p>
                  )}

                  {/* Mix & Match config */}
                  {item.mixMatch && (
                    <div className="bg-blush/30 border border-border rounded p-2 text-[10px] sm:text-xs text-brown max-w-xs sm:max-w-md">
                      <span className="font-bold text-primary font-cinzel block mb-1">
                        Custom Assortment ({item.mixMatch.size} pcs):
                      </span>
                      <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5 list-disc list-inside font-body">
                        {item.mixMatch.selectedItems.map((selected, idx) => (
                          <li key={idx} className="truncate">
                            {selected.quantity}x {selected.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Quantity Adjuster */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:ml-auto w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                {/* Quantity adjustments */}
                <div className="flex items-center border border-border rounded-lg bg-cream/30">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="p-1.5 text-primary hover:text-accent transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-primary-deep font-cinzel w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="p-1.5 text-primary hover:text-accent transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="text-[10px] text-brown font-semibold block uppercase tracking-wider font-cinzel">Subtotal</span>
                  <span className="font-cinzel text-sm sm:text-base text-accent font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFromCart(item.cartItemId)}
                className="absolute top-4 right-4 p-1 text-brown hover:text-primary transition-colors duration-200"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Right: Summary panel */}
        <div className="bg-white border border-border rounded-xl p-5 sm:p-6 space-y-6 shadow-sm sticky top-24">
          <h2 className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-bold border-b border-border pb-3">
            Order Summary
          </h2>

          <div className="space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-brown font-semibold">Subtotal</span>
              <span className="font-cinzel font-bold text-primary-deep">${subtotal.toFixed(2)}</span>
            </div>

            {/* Delivery fee (depends on fulfillment preview) */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-brown font-semibold flex items-center">
                <Truck className="h-4 w-4 mr-1.5 text-primary/70" />
                <span>Fulfillment Type</span>
              </span>
              <span className="font-cinzel font-bold text-primary-deep capitalize">
                {fulfillment}
              </span>
            </div>

            {fulfillment === 'delivery' ? (
              <div className="flex justify-between items-center text-xs">
                <span className="text-brown font-semibold">Delivery Fee</span>
                <span className="font-cinzel font-bold text-primary-deep">${deliveryFee.toFixed(2)}</span>
              </div>
            ) : (
              <div className="p-3 bg-blush/35 rounded-lg border border-border text-[11px] text-brown flex items-start space-x-1.5">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>
                  contactless pickup selected at **Houston, Texas 77498** (Free of charge).
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center border-t border-border pt-4">
              <span className="font-cinzel text-xs uppercase tracking-widest text-brown font-bold">Estimated Total</span>
              <span className="font-cinzel text-lg text-primary font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full btn-gold py-3.5 text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 text-accent" />
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/menu"
              className="text-[11px] text-brown hover:text-primary font-semibold font-body"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
