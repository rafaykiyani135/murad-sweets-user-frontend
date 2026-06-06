'use client';

import { X, Check } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PITHA_ITEMS = [
  {
    id: 'puli-pitha',
    name: 'Puli Pitha',
    price: 25,
    description: '10pc box • Sweet half-moon dumplings filled with coconut and Khejur Gur (date molasses).',
    image: 'https://items-images-production-f.squarecdn.com/files/8fbb667ff8b9e6808b5adfa6c48cdc69ffb33204/original.jpeg?width=512&crop=1%3A1&format=webp'
  },
  {
    id: 'nokshi-pitha',
    name: 'Nokshi Pitha',
    price: 30,
    description: '10pc box • Intricately designed crispy rice cakes infused with warm date molasses syrup.',
    image: 'https://items-images-production-f.squarecdn.com/files/7210719d85ecdc103efdd809ab6be9c6dc949160/original.png?width=512&crop=1%3A1&format=webp'
  },
  {
    id: 'patishapta-pitha',
    name: 'Patishapta Pitha',
    price: 30,
    description: '10pc box • Delicate rice crepes rolled with a rich kheer (reduced milk) and coconut filling.',
    image: 'https://items-images-production-f.squarecdn.com/files/036ad42f8b2e9574c99e5f27ef50dc1c7ed5c25f/original.jpeg?width=512&crop=1%3A1&format=webp'
  }
];

export default function PithaModal() {
  const {
    isPithaModalOpen,
    closePithaModal,
    addToCart,
  } = useCart();

  const handleAddToCart = (item: typeof PITHA_ITEMS[0]) => {
    addToCart({
      productId: `pitha-${item.id}`,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      unit: '10pc box',
    });
    closePithaModal();
  };

  if (!isPithaModalOpen) return null;

  return (
    <AnimatePresence>
      {isPithaModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={closePithaModal}
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
                  Traditional Pitha
                </span>
                <button
                  onClick={closePithaModal}
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
                    Traditional Pitha Collections
                  </h2>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base mt-4 font-body leading-relaxed">
                    A taste of heritage. Traditional Bangladeshi pitha made the authentic way, just like home.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {PITHA_ITEMS.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl border border-[#E8C8C8] overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group flex flex-col justify-between"
                      onClick={() => handleAddToCart(item)}
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
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xl font-black text-primary shrink-0">
                            ${item.price}.00
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
