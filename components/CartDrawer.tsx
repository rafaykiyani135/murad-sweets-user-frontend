'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
  } = useCart();

  const subtotal = getCartSubtotal();

  const handleCheckoutClick = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  const handleBrowseClick = () => {
    setCartOpen(false);
    router.push('/menu');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-cream shadow-2xl z-50 flex flex-col h-full border-l border-border"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border bg-primary-deep text-cream flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-accent" />
                <h2 className="font-subheading text-base sm:text-lg tracking-wider uppercase">Your Cart</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-full text-cream/75 hover:text-accent hover:bg-white/10 transition-colors duration-200"
                aria-label="Close cart"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
              {cartItems.length === 0 ? (
                /* Empty Cart State */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 px-4">
                  <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center text-primary">
                    <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-subheading text-lg text-primary-deep">Your cart is empty</h3>
                    <p className="text-sm text-brown mt-2">
                      Looks like you haven&apos;t added any traditional sweets to your box yet.
                    </p>
                  </div>
                  <button
                    onClick={handleBrowseClick}
                    className="btn-gold py-2.5 px-6 text-xs uppercase tracking-widest"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                /* Items List */
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      layout
                      key={item.cartItemId}
                      className="p-3 bg-white rounded-lg border border-border shadow-sm flex space-x-3 items-start relative group"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-16 h-16 rounded bg-blush overflow-hidden flex-shrink-0 relative">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-primary-deep/60">
                            Mithai
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-cinzel text-sm text-primary-deep truncate font-semibold">
                          {item.name}
                        </h4>
                        
                        {item.unit && (
                          <p className="text-[10px] text-brown font-body font-semibold">
                            {item.unit}
                          </p>
                        )}

                        {/* Mix & Match details */}
                        {item.mixMatch && (
                          <div className="mt-1 bg-blush/40 border border-border/40 rounded p-1.5 text-[10px] text-brown">
                            <span className="font-bold text-primary font-cinzel block mb-0.5">
                              Custom Box Selection ({item.mixMatch.size} pcs):
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 font-body">
                              {item.mixMatch.selectedItems.map((selected, idx) => (
                                <li key={idx} className="truncate">
                                  {selected.quantity}x {selected.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Price */}
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-xs font-cinzel text-accent font-bold">
                            ${item.price.toFixed(2)}
                          </p>

                          {/* Quantity adjustments */}
                          <div className="flex items-center border border-border rounded bg-cream/30">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="p-1 text-primary hover:text-accent transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-primary-deep">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="p-1 text-primary hover:text-accent transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="absolute top-2 right-2 p-1 text-brown hover:text-primary transition-colors duration-200"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary (Only show if cart has items) */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 bg-white border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-subheading text-xs uppercase tracking-widest text-brown">Subtotal</span>
                  <span className="font-subheading text-lg text-primary font-bold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-brown italic">
                  Fulfillment preferences, delivery fees, and schedule details are configured at checkout.
                </p>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full btn-gold py-3 text-xs uppercase tracking-widest"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full py-2 text-center text-xs text-primary font-subheading hover:text-primary-deep font-semibold tracking-wider transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
