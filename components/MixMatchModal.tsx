'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { PRODUCTS, MIX_MATCH_PRICES } from '@/app/data/products';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const BOX_IMAGES = {
  3: 'https://items-images-production-f.squarecdn.com/files/9ba888a143b397cf4ab2deda5c727d5bb80f8da9/original.jpeg?width=512&crop=1%3A1&format=webp',
  6: 'https://items-images-production-f.squarecdn.com/files/fc1de58a35a7f9872d30cbc5cd86239cda863980/original.jpeg?width=512&crop=1%3A1&format=webp',
  9: 'https://items-images-production-f.squarecdn.com/files/eac57c2d50106f70c33ea9f1caee98d15bf707e7/original.jpeg?width=512&crop=1%3A1&format=webp',
} as const;

export default function MixMatchModal() {
  const { isMixMatchOpen, mixMatchProduct, closeMixMatch, addToCart } = useCart();

  const [boxSize, setBoxSize] = useState<3 | 6 | 9>(3);
  const [selections, setSelections] = useState<{ [productId: string]: number }>({});

  // Filter available dry sweets that are in stock
  const drySweets = PRODUCTS.filter((p) => p.category === 'dry-sweets' && p.inStock);

  // Initialize/Reset selections when product changes or box size changes
  useEffect(() => {
    if (mixMatchProduct) {
      // Start with 1 of the clicked sweet
      setSelections({
        [mixMatchProduct.id]: 1
      });
    } else {
      setSelections({});
    }
  }, [mixMatchProduct]);

  if (!mixMatchProduct) return null;

  const currentTotal = Object.values(selections).reduce((acc, qty) => acc + qty, 0);
  const isBoxFull = currentTotal === boxSize;

  const handleSizeChange = (size: 3 | 6 | 9) => {
    setBoxSize(size);
    // Reset selections but keep 1 of the core clicked sweet
    setSelections({
      [mixMatchProduct.id]: 1
    });
  };

  const updateSweetQty = (sweetId: string, delta: number) => {
    const currentQty = selections[sweetId] || 0;
    const newQty = currentQty + delta;

    if (newQty < 0) return;

    // Prevent exceeding the box size
    if (delta > 0 && currentTotal >= boxSize) return;

    setSelections({
      ...selections,
      [sweetId]: newQty
    });
  };

  const handleAddBoxToCart = () => {
    if (!isBoxFull) return;

    // Compile selected items details
    const selectedItems = Object.entries(selections)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const prod = PRODUCTS.find((p) => p.id === id);
        return {
          id,
          name: prod ? prod.name : 'Unknown Sweet',
          quantity: qty
        };
      });

    const price = MIX_MATCH_PRICES[boxSize];

    addToCart({
      productId: `mixmatch-${boxSize}`,
      name: `${boxSize} Pcs Mix & Match Box`,
      price,
      quantity: 1,
      image: BOX_IMAGES[boxSize],
      unit: 'Custom Assortment',
      mixMatch: {
        size: boxSize,
        price,
        selectedItems
      }
    });

    closeMixMatch();
  };

  return (
    <AnimatePresence>
      {isMixMatchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeMixMatch}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 top-4 md:inset-y-auto md:max-w-2xl md:w-full md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-50 bg-cream rounded-xl border border-border shadow-elevated flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border bg-primary-deep text-cream flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-heading text-lg sm:text-xl text-accent">Customize Your Mithai Box</h3>
                <p className="text-xs text-cream/70 mt-1 font-body">Select a box size and pick your favorite traditional sweets.</p>
              </div>
              <button
                onClick={closeMixMatch}
                className="p-1 rounded-full text-cream/75 hover:text-accent hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
              {/* Box Size Selector */}
              <div>
                <span className="block font-cinzel text-xs uppercase tracking-wider text-primary-deep mb-3 font-semibold">
                  1. Choose Box Size
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {([3, 6, 9] as const).map((size) => {
                    const price = MIX_MATCH_PRICES[size];
                    const isSelected = boxSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`p-3 rounded-lg border text-center transition-all duration-300 flex flex-col items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-primary border-primary text-white shadow-md'
                            : 'bg-white border-border text-primary-deep hover:border-primary/50'
                        }`}
                      >
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-blush/30 rounded-lg overflow-hidden shadow-inner shrink-0">
                          <Image
                            src={BOX_IMAGES[size]}
                            alt={`${size} Pieces Box`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 48px, 64px"
                          />
                        </div>
                        <div>
                          <span className="font-cinzel text-xs sm:text-sm font-bold block">{size} Pieces</span>
                          <span className={`text-xs block mt-0.5 ${isSelected ? 'text-accent' : 'text-[#681628] font-bold'}`}>
                            ${price}.00
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sweet Selector Section */}
              <div>
                <div className="flex justify-between items-center border-b border-border pb-2.5 mb-4">
                  <span className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-semibold">
                    2. Select Sweets ({currentTotal} of {boxSize} pcs)
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded font-cinzel ${isBoxFull ? 'bg-primary text-white' : 'bg-blush text-primary'}`}>
                    {isBoxFull ? 'Box Filled!' : `${boxSize - currentTotal} remaining`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {drySweets.map((sweet) => {
                    const count = selections[sweet.id] || 0;
                    return (
                      <div
                        key={sweet.id}
                        className={`p-3 bg-white rounded-lg border flex items-center justify-between transition-all duration-200 ${
                          count > 0 ? 'border-primary/60 shadow-sm' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2 flex-1">
                          {sweet.images?.[0] && (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
                              <Image
                                src={sweet.images[0]}
                                alt={sweet.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="font-cinzel text-xs font-semibold text-primary-deep block truncate">{sweet.name}</span>
                            <span className="text-[10px] text-brown font-body line-clamp-1 mt-0.5">{sweet.description}</span>
                          </div>
                        </div>

                        {/* Adjuster */}
                        <div className="flex items-center space-x-2 bg-cream/30 border border-border rounded">
                          <button
                            onClick={() => updateSweetQty(sweet.id, -1)}
                            disabled={count === 0}
                            className={`p-1.5 transition-colors ${
                              count === 0 ? 'text-gray-300' : 'text-primary hover:text-accent'
                            }`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-semibold w-4 text-center text-primary-deep font-cinzel">
                            {count}
                          </span>
                          <button
                            onClick={() => updateSweetQty(sweet.id, 1)}
                            disabled={isBoxFull}
                            className={`p-1.5 transition-colors ${
                              isBoxFull ? 'text-gray-300' : 'text-primary hover:text-accent'
                            }`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] text-brown uppercase font-semibold tracking-wider font-cinzel">Total Price</span>
                <span className="font-cinzel text-xl text-primary font-bold">
                  ${MIX_MATCH_PRICES[boxSize]}.00
                </span>
              </div>

              <button
                onClick={handleAddBoxToCart}
                disabled={!isBoxFull}
                className={`py-3 px-8 text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
                  isBoxFull
                    ? 'btn-gold shadow-md'
                    : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                }`}
              >
                {isBoxFull && <Check className="h-4 w-4 mr-1 text-accent" />}
                <span>{isBoxFull ? 'Add Custom Box' : `Fill Box (${boxSize - currentTotal} left)`}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
