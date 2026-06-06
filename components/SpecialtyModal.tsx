'use client';

import { useState } from 'react';
import { X, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const SPECIALTY_ITEMS = [
  {
    id: 'roshgulla-cake',
    name: 'Roshgulla Cake',
    price: 7,
    description: '8oz cake',
    image: 'https://items-images-production-f.squarecdn.com/files/31a02e7612b5bcec1b0d49a0f4c12b111093ddd2/original.jpeg?width=512&crop=1%3A1&format=webp'
  },
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    price: 6,
    description: '4pc box',
    image: 'https://items-images-production-f.squarecdn.com/files/e165ec6df7b6a9094b2a46d22efc4d107061e1f8/original.jpeg?width=512&crop=1%3A1&format=webp'
  },
  {
    id: 'mishti-doi',
    name: 'Mishti Doi',
    price: 10,
    description: '16oz box',
    image: 'https://items-images-production-f.squarecdn.com/files/df9819ae66b601cb6a5dd06592526c8946e78e7f/original.jpeg?width=512&crop=1%3A1&format=webp'
  }
];

export default function SpecialtyModal() {
  const {
    isSpecialtyModalOpen,
    closeSpecialtyModal,
    addToCart,
  } = useCart();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (id: string) => quantities[id] || 1;
  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddToCart = (item: typeof SPECIALTY_ITEMS[0], quantity: number) => {
    addToCart({
      productId: `specialty-${item.id}`,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      unit: item.description,
    });
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    closeSpecialtyModal();
  };

  if (!isSpecialtyModalOpen) return null;

  return (
    <AnimatePresence>
      {isSpecialtyModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={closeSpecialtyModal}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="pointer-events-auto bg-[#FAF6F0] rounded-3xl border border-[#E8C8C8] shadow-elevated flex flex-col overflow-hidden w-full max-w-4xl max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Modal header bar */}
              <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-[#E8C8C8] bg-[#FFF4EE] shrink-0">
                <span className="text-xs font-subheading uppercase tracking-widest text-primary font-bold">
                  Specialty Items
                </span>
                <button
                  onClick={closeSpecialtyModal}
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
                    Specialty Items
                  </h2>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base mt-4 font-body leading-relaxed">
                    Indulge in our rich and premium specialty sweets made for true sweet lovers.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {SPECIALTY_ITEMS.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl border border-[#E8C8C8] overflow-hidden shadow-sm hover:shadow-lg transition-shadow group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-square w-full">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <div className="p-5 pb-0">
                          <h3 className="font-bold text-lg text-[#1A1A1A] font-heading">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="p-5 pt-3">
                        <div className="flex flex-col gap-3 mt-2">
                          <span className="text-xl font-black text-primary shrink-0 leading-none">
                            ${item.price}.00
                          </span>
                          
                          <div className="flex items-stretch gap-2.5">
                            <div className="flex items-center justify-between bg-[#FAF6F0] border border-[#E8C8C8] rounded-xl px-1.5 flex-[0.8]">
                              <button 
                                onClick={() => updateQty(item.id, -1)}
                                className="p-1.5 text-primary hover:text-accent disabled:opacity-50 transition-opacity"
                                disabled={getQty(item.id) <= 1}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-sm font-bold text-center text-primary-deep font-cinzel select-none">
                                {getQty(item.id)}
                              </span>
                              <button 
                                onClick={() => updateQty(item.id, 1)}
                                className="p-1.5 text-primary hover:text-accent transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleAddToCart(item, getQty(item.id))}
                              className="flex items-center justify-center gap-1.5 bg-[#681628] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#541523] transition-colors flex-[1.2] shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Add
                            </button>
                          </div>
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
