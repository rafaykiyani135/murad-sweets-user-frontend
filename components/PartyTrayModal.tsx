'use client';

import { X, Check } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PARTY_TRAY_OPTIONS = [
  {
    id: 'small',
    name: 'Small Party Tray',
    price: 30,
    description: 'A beautiful arrangement of 15-18 assorted premium dry sweets, perfect for family get-togethers.',
    image: 'https://items-images-production-f.squarecdn.com/files/78e849cba554ce2e5d5b5d8ad68a686db811ac04/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'large',
    name: 'Large Party Tray',
    price: 60,
    description: 'A grand presentation tray with 35-40 pieces of our finest sweets, featuring an assortment of traditional mithai.',
    image: 'https://items-images-production-f.squarecdn.com/files/da72ce861326317196b4aa8de5c09907e5b981c1/original.jpeg?width=512&crop=1%3A1&format=webp'
  }
];

export default function PartyTrayModal() {
  const {
    isPartyTrayModalOpen,
    closePartyTrayModal,
    addToCart,
  } = useCart();

  const handleAddToCart = (option: typeof PARTY_TRAY_OPTIONS[0]) => {
    addToCart({
      productId: `party-tray-${option.id}`,
      name: option.name,
      price: option.price,
      quantity: 1,
      image: option.image,
      unit: 'Tray',
    });
    closePartyTrayModal();
  };

  if (!isPartyTrayModalOpen) return null;

  return (
    <AnimatePresence>
      {isPartyTrayModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={closePartyTrayModal}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="pointer-events-auto bg-[#FAF6F0] rounded-3xl border border-[#E8C8C8] shadow-elevated flex flex-col overflow-hidden w-full max-w-3xl max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Modal header bar */}
              <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-[#E8C8C8] bg-[#FFF4EE] shrink-0">
                <span className="text-xs font-subheading uppercase tracking-widest text-primary font-bold">
                  Party Trays
                </span>
                <button
                  onClick={closePartyTrayModal}
                  className="p-2 rounded-full text-primary-deep/60 hover:text-primary hover:bg-white/80 transition-colors pointer-events-auto cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                <header className="text-center mb-10">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A] font-heading">
                    Select Your Party Tray
                  </h2>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base mt-4 font-body leading-relaxed">
                    Beautifully arranged trays for weddings, gatherings and celebrations. Made to impress.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {PARTY_TRAY_OPTIONS.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl border border-[#E8C8C8] overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group flex flex-col justify-between"
                      onClick={() => handleAddToCart(option)}
                    >
                      <div>
                        <div className="relative aspect-square w-full">
                          <Image
                            src={option.image}
                            alt={option.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <div className="p-5 pb-0">
                          <h3 className="font-bold text-lg text-[#1A1A1A] font-heading">
                            {option.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">{option.description}</p>
                        </div>
                      </div>
                      <div className="p-5 pt-3">
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xl font-black text-primary shrink-0">
                            ${option.price}.00
                          </span>
                          <button
                            className="flex items-center gap-1.5 bg-[#681628] text-white px-3 py-2 rounded-lg font-semibold text-xs hover:bg-[#541523] transition-colors pointer-events-none whitespace-nowrap shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
