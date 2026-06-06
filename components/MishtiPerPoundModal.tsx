'use client';

import { useState } from 'react';
import { X, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const MISHTI_ITEMS = [
  {
    id: 'mpp-brown-chom-chom',
    name: 'Brown Chom Chom',
    price: 13,
    unit: 'per lb',
    description: 'Classic Bangladeshi oval-shaped sweet made of dense chenna (curdled milk), slowly cooked to a rich mahogany brown color.',
    image: 'https://items-images-production-f.squarecdn.com/files/0a1baff12638918784fd42eec0e02233c57874f2/original.jpeg?width=512&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-white-chom-chom',
    name: 'White Chom Chom',
    price: 12,
    unit: 'per lb',
    description: 'Delicate, ivory-white chom chom made of soft chenna, simmered in light syrup.',
    image: 'https://items-images-production-f.squarecdn.com/files/85c894a2cdfa49fc91468a6ed389376d7bd901e1/original.png?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-kalojam',
    name: 'Kalojam',
    price: 12,
    unit: 'per lb',
    description: 'Traditional deep-fried milk-solid dumplings soaked in sugar syrup, featuring a caramelized outer layer.',
    image: 'https://items-images-production-f.squarecdn.com/files/ef1d699f951f2db300ae859cc6b39897c79095b8/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-rajbhog',
    name: 'Rajbhog',
    price: 12,
    unit: 'per lb',
    description: 'Grand-sized chenna spheres stuffed with dry fruits, simmered in saffron syrup.',
    image: 'https://items-images-production-f.squarecdn.com/files/95c97a84a6f3b0265c89796fe61e83547fc30bbd/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-malaikari',
    name: 'Malaikari',
    price: 13,
    unit: 'per lb',
    description: 'Plump chenna rounds cooked in syrup and coated with luscious saffron malai reduction.',
    image: 'https://items-images-production-f.squarecdn.com/files/b1197d7095486976b4b572dbd02f821bfdbca151/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-shandesh',
    name: 'Shandesh',
    price: 13,
    unit: 'per lb',
    description: 'Traditional dry sweet made from fresh paneer and date molasses.',
    image: 'https://items-images-production-f.squarecdn.com/files/c3fd77de3125fbebfaf08a34328df9718f044cf9/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-gulab-jamun',
    name: 'Gulab Jamun',
    price: 12,
    unit: 'per lb',
    description: 'Soft milk-solid balls fried, sweetened, and rolled in desiccated coconut.',
    image: 'https://items-images-production-f.squarecdn.com/files/e165ec6df7b6a9094b2a46d22efc4d107061e1f8/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-kheer-mouchak',
    name: 'Kheer Mouchak',
    price: 13,
    unit: 'per lb',
    description: 'Honeycomb-shaped delight made with chenna and covered with creamy reduced milk.',
    image: 'https://items-images-production-f.squarecdn.com/files/6b5ab94ac6f70f24feba421fb318ef7c9efa9917/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-kala-jamun-sandwich',
    name: 'Kala Jamun Sandwich',
    price: 13,
    unit: 'per lb',
    description: 'Variation of Kalojam filled with a thick layer of sweetened cream (malai).',
    image: 'https://items-images-production-f.squarecdn.com/files/1e4a710e5852bebb0ec3993ac604e4dd9dedf4c5/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-laddu',
    name: 'Laddu',
    price: 13,
    unit: 'per lb',
    description: 'Aromatic Motichoor Laddus made from tiny chickpea flour globules.',
    image: 'https://items-images-production-f.squarecdn.com/files/3894a89462eb13d67a7d65a15bed28c891501566/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-katari-bhog',
    name: 'Katari Bhog',
    price: 15,
    unit: 'per lb',
    description: 'Artisanal sweet consisting of textured chenna balls cooked in date jaggery syrup.',
    image: 'https://items-images-production-f.squarecdn.com/files/5f2e1c7cf8e32ecc2c4dec89d5b0add8c62faa72/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-sponge-roshogolla',
    name: 'Sponge RoshoGolla',
    price: 13,
    unit: 'per lb',
    description: 'Light, spongy cottage cheese balls soaked in clear sugar syrup.',
    image: 'https://items-images-production-f.squarecdn.com/files/0029b1cd24594552c6599c39c2cae943b9cf9add/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-classic-roshogolla',
    name: 'Classic RoshoGolla',
    price: 12,
    unit: 'per lb',
    description: 'Traditional Bengali melt-in-mouth cottage cheese balls in sweet syrup.',
    image: 'https://items-images-production-f.squarecdn.com/files/e8fc97b3018980221d29bdab1d177b64e46fe4be/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-peda',
    name: 'Peda',
    price: 12,
    unit: 'per dozen',
    description: 'Rich, semi-soft sweet made of condensed milk and sugar.',
    image: 'https://items-images-production-f.squarecdn.com/files/5959be5a1eecc7bcef1982dcc39a1fe151edabd7/original.jpeg?width=640&crop=1%3A1&format=webp'
  },
  {
    id: 'mpp-katcha-golla',
    name: 'Katcha Golla',
    price: 14,
    unit: 'per lb',
    description: 'Soft, melt-in-the-mouth raw sweet made of fresh chenna and sugar.',
    image: 'https://items-images-production-f.squarecdn.com/files/31d55e49fd7912d22b9914e99509e815420f3236/original.jpeg?width=640&crop=1%3A1&format=webp'
  }
];

export default function MishtiPerPoundModal() {
  const {
    isMishtiPerPoundModalOpen,
    closeMishtiPerPoundModal,
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

  const handleAddToCart = (item: typeof MISHTI_ITEMS[0], quantity: number) => {
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      unit: item.unit,
    });
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    closeMishtiPerPoundModal();
  };

  if (!isMishtiPerPoundModalOpen) return null;

  return (
    <AnimatePresence>
      {isMishtiPerPoundModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={closeMishtiPerPoundModal}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="pointer-events-auto bg-[#FAF6F0] rounded-3xl border border-[#E8C8C8] shadow-elevated flex flex-col overflow-hidden w-full max-w-5xl max-h-[90vh]"
            >
              {/* Modal header bar */}
              <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-[#E8C8C8] bg-[#FFF4EE] shrink-0">
                <span className="text-xs font-subheading uppercase tracking-widest text-primary font-bold">
                  Mishti Per Pound
                </span>
                <button
                  onClick={closeMishtiPerPoundModal}
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
                    Mishti Per Pound
                  </h2>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base mt-4 font-body leading-relaxed">
                    Fresh traditional sweets sold by the pound or dozen. Made fresh daily.
                  </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {MISHTI_ITEMS.map((item) => (
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
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <div className="p-4 pb-0">
                          <h3 className="font-bold text-base text-[#1A1A1A] font-heading">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1 font-body leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 pt-3">
                        <div className="flex flex-col gap-3 mt-2">
                          <div className="flex flex-col">
                            <span className="text-lg font-black text-primary leading-none">
                              ${item.price}.00
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                              {item.unit}
                            </span>
                          </div>

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
