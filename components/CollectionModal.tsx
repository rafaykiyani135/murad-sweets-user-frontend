'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/app/store/useCart';
import {
  PRODUCTS,
  ASSORTED_BOX_PRICES,
  SWEET_DISPLAY_META,
  COLLECTION_MODAL_COPY,
  type AssortedBoxSize,
  type Product,
} from '@/app/data/products';

import Image from 'next/image';

type BoxSweet = { name: string; color: string; image?: string };

const BOX_SIZES: AssortedBoxSize[] = [3, 6, 9];

const BOX_IMAGES = {
  3: 'https://items-images-production-f.squarecdn.com/files/9ba888a143b397cf4ab2deda5c727d5bb80f8da9/original.jpeg?width=512&crop=1%3A1&format=webp',
  6: 'https://items-images-production-f.squarecdn.com/files/fc1de58a35a7f9872d30cbc5cd86239cda863980/original.jpeg?width=512&crop=1%3A1&format=webp',
  9: 'https://items-images-production-f.squarecdn.com/files/eac57c2d50106f70c33ea9f1caee98d15bf707e7/original.jpeg?width=512&crop=1%3A1&format=webp',
} as const;

const GRID_COLS: Record<AssortedBoxSize, string> = {
  3: 'grid-cols-3',
  6: 'grid-cols-3',
  9: 'grid-cols-3',
};

function SweetIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill={color}>
      <circle cx="12" cy="12" r="8" opacity="0.85" />
      <circle cx="9" cy="10" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

export default function CollectionModal() {
  const {
    isCollectionModalOpen,
    collectionCategory,
    closeCollectionModal,
    addToCart,
    addToast,
  } = useCart();

  const [boxSize, setBoxSize] = useState<AssortedBoxSize>(3);
  const [boxPrice, setBoxPrice] = useState<number>(ASSORTED_BOX_PRICES[3]);
  const [boxItems, setBoxItems] = useState<BoxSweet[]>([]);

  const category = collectionCategory ?? 'dry-sweets';
  const copy = COLLECTION_MODAL_COPY[category];

  const availableSweets = PRODUCTS.filter(
    (p) => p.category === category && p.inStock
  );

  const resetBuilder = useCallback(() => {
    setBoxSize(3);
    setBoxPrice(ASSORTED_BOX_PRICES[3]);
    setBoxItems([]);
  }, []);

  useEffect(() => {
    if (isCollectionModalOpen) {
      resetBuilder();
    }
  }, [isCollectionModalOpen, collectionCategory, resetBuilder]);

  const selectBoxSize = (size: AssortedBoxSize, price: number) => {
    setBoxSize(size);
    setBoxPrice(price);
    setBoxItems([]);
  };

  const addSweetToBox = (name: string, color: string, image?: string) => {
    if (boxItems.length >= boxSize) return;
    setBoxItems((prev) => [...prev, { name, color, image }]);
  };

  const removeSweetFromBox = (index: number) => {
    setBoxItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearBox = () => setBoxItems([]);

  const filledCount = boxItems.length;
  const isBoxFull = filledCount === boxSize;

  const addCompleteBoxToCart = () => {
    if (!isBoxFull) {
      addToast(`Please fill all ${boxSize} slots before adding to cart.`, 'error');
      return;
    }

    const sweetNames = boxItems.map((s) => s.name).join(', ');
    const itemName = `Assorted Custom ${boxSize}-Pack Box (${sweetNames})`;

    addToCart({
      productId: `assorted-${boxSize}-${Date.now()}`,
      name: itemName,
      price: boxPrice,
      quantity: 1,
      image: BOX_IMAGES[boxSize],
      unit: 'Custom Assortment',
      assortedBox: {
        size: boxSize,
        price: boxPrice,
        selectedItems: boxItems,
      },
    });

    resetBuilder();
    closeCollectionModal();
  };

  if (!isCollectionModalOpen || !collectionCategory) return null;

  return (
    <AnimatePresence>
      {isCollectionModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={closeCollectionModal}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-x-3 top-3 bottom-3 sm:inset-x-6 sm:top-6 sm:bottom-6 md:inset-x-10 md:top-10 md:bottom-10 z-[60] bg-[#FAF6F0] rounded-3xl border border-[#E8C8C8] shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Modal header bar */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-[#E8C8C8] bg-[#FFF4EE] shrink-0">
              <span className="text-xs font-subheading uppercase tracking-widest text-primary font-bold">
                Collection Builder
              </span>
              <button
                onClick={closeCollectionModal}
                className="p-2 rounded-full text-primary-deep/60 hover:text-primary hover:bg-white/80 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <section className="border-b border-[#E8C8C8] py-10 sm:py-14 px-4 sm:px-8">
                <header className="text-center mb-10 sm:mb-12">
                  <span className="text-primary text-sm font-extrabold uppercase tracking-widest block mb-2">
                    {copy.tagline}
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1A1A1A] font-heading">
                    {copy.title}
                  </h2>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base mt-4 font-body leading-relaxed">
                    {copy.description}
                  </p>
                </header>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left column — box configurator */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Step 1: Box size */}
                    <div>
                      <h3 className="font-subheading text-xs uppercase tracking-wider text-primary-deep font-semibold mb-4">
                        1. Choose Box Size
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {BOX_SIZES.map((size) => {
                          const price = ASSORTED_BOX_PRICES[size];
                          const isActive = boxSize === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => selectBoxSize(size, price)}
                              className={`border-2 rounded-2xl p-3 transition-all text-center flex flex-col items-center justify-between gap-2.5 ${
                                isActive
                                  ? 'border-primary bg-primary/5 text-[#1A1A1A] scale-105 shadow-sm'
                                  : 'border-gray-200 hover:border-primary/50 bg-white'
                              }`}
                            >
                              <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-blush/30 rounded-xl overflow-hidden shadow-inner shrink-0">
                                <Image
                                  src={BOX_IMAGES[size]}
                                  alt={`${size}-Pack Box`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 56px, 80px"
                                />
                              </div>
                              <div>
                                <span className="text-lg sm:text-2xl font-black block">{size}-Pack</span>
                                <span className="text-xs text-gray-500 font-bold mt-0.5 block">
                                  ${price}.00
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Virtual box preview */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-subheading text-sm font-bold text-[#1A1A1A]">
                          2. Your Assorted Box
                        </h3>
                        <button
                          type="button"
                          onClick={clearBox}
                          className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-primary transition-colors"
                        >
                          Clear Box
                        </button>
                      </div>

                      <div
                        id="box-grid"
                        className="bg-[#FAF6F0] p-4 sm:p-6 rounded-2xl border-2 border-dashed border-[#E8C8C8] min-h-[250px]"
                      >
                        <div className={`grid ${GRID_COLS[boxSize]} gap-3 sm:gap-4`}>
                          {Array.from({ length: boxSize }).map((_, index) => {
                            const sweet = boxItems[index];
                            if (sweet) {
                              return (
                                <motion.div
                                  key={`filled-${index}-${sweet.name}`}
                                  initial={{ scale: 0.85, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                                  className="relative aspect-square bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E8C8C8]"
                                >
                                  {sweet.image ? (
                                    <Image
                                      src={sweet.image}
                                      alt={sweet.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 120px, 160px"
                                    />
                                  ) : (
                                    <div
                                      className="absolute inset-0 flex items-center justify-center"
                                      style={{ backgroundColor: sweet.color }}
                                    />
                                  )}

                                  {/* Gradient Overlay for text legibility */}
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-6 pb-2 px-2 flex items-end justify-center pointer-events-none">
                                    <span className="text-[9px] sm:text-[10px] font-extrabold text-white text-center leading-none truncate w-full">
                                      {sweet.name}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeSweetFromBox(index)}
                                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 hover:bg-[#681628] text-white text-[10px] font-bold flex items-center justify-center transition-colors leading-none z-10 shadow-md"
                                    aria-label={`Remove ${sweet.name}`}
                                  >
                                    ✕
                                  </button>
                                </motion.div>
                              );
                            }

                            return (
                              <div
                                key={`empty-${index}`}
                                className="aspect-square border border-dashed border-primary/30 bg-blush/20 text-primary/40 flex flex-col items-center justify-center rounded-2xl"
                              >
                                <Plus className="w-6 h-6 mb-1" strokeWidth={1.5} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column — sweets selection */}
                  <div className="lg:col-span-5">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col">
                      <h3 className="font-subheading text-xs uppercase tracking-wider text-primary-deep font-semibold mb-5">
                        3. Pick Your Sweets
                      </h3>

                      <div className="max-h-[450px] overflow-y-auto pr-2 space-y-3 flex-1">
                        {availableSweets.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-8">
                            No items available in this collection right now.
                          </p>
                        ) : (
                          availableSweets.map((sweet) => (
                            <SweetRow
                              key={sweet.id}
                              product={sweet}
                              isBoxFull={isBoxFull}
                              onAdd={addSweetToBox}
                            />
                          ))
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={addCompleteBoxToCart}
                        className={`w-full py-4 rounded-2xl uppercase tracking-wider font-extrabold transition-colors duration-300 mt-6 text-sm ${
                          isBoxFull
                            ? 'bg-primary text-white hover:bg-primary-deep'
                            : 'bg-[#1A1A1A] text-white hover:bg-[#333]'
                        }`}
                      >
                        {isBoxFull
                          ? `Add Assorted Box to Cart • $${boxPrice}.00`
                          : `Add Assorted Box to Cart (${filledCount}/${boxSize} Filled) • $${boxPrice}.00`}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SweetRow({
  product,
  isBoxFull,
  onAdd,
}: {
  product: Product;
  isBoxFull: boolean;
  onAdd: (name: string, color: string, image?: string) => void;
}) {
  const meta = SWEET_DISPLAY_META[product.slug] ?? {
    color: '#7B1E2B',
    bgClass: 'bg-blush',
    flavorType: 'Classic',
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF6F0]/60 transition-colors">
      {product.images?.[0] ? (
        <div className="relative w-12 h-12 rounded-full shrink-0 overflow-hidden border border-[#E8C8C8]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      ) : (
        <div
          className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${meta.bgClass}`}
        >
          <SweetIcon color={meta.color} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-snug text-[#1A1A1A]">{product.name}</p>
      </div>

      <button
        type="button"
        disabled={isBoxFull}
        onClick={() => onAdd(product.name, meta.color, product.images?.[0])}
        className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full uppercase transition-colors ${
          isBoxFull
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#1A1A1A] text-white hover:bg-primary'
        }`}
      >
        + Add
      </button>
    </div>
  );
}
