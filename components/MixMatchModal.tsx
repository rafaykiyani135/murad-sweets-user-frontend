'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { MIX_MATCH_PRICES } from '@/app/data/products';
import { useCatalog } from '@/app/store/useCatalog';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const BOX_IMAGES = {
  3: '/3-piece-box.webp',
  6: '/6-piece-box.webp',
  9: '/9-piece-box.webp',
} as const;

export default function MixMatchModal() {
  const { isMixMatchOpen, mixMatchProduct, closeMixMatch, addToCart } = useCart();
  const { products: PRODUCTS, fetchCatalog } = useCatalog();

  const [boxSize, setBoxSize] = useState<3 | 6 | 9>(3);
  const [selections, setSelections] = useState<{ [productId: string]: number }>({});
  const [boxQuantity, setBoxQuantity] = useState(1);

  const isPartyTray = mixMatchProduct?.category === 'party-trays';
  const fixedSize = mixMatchProduct?.slug === 'small-party-tray' ? 18 : (mixMatchProduct?.slug === 'large-party-tray' ? 40 : null);
  const activeBoxSize = fixedSize || boxSize;
  const activePrice = isPartyTray ? mixMatchProduct!.price : MIX_MATCH_PRICES[activeBoxSize as 3 | 6 | 9];

  // Filter available dry sweets (excluding mix and match boxes)
  const excludedForPartyTray = ['peda', 'kalojam-sandwich', 'kathari-bhog', 'kheer-mouchak'];
  const drySweets = PRODUCTS.filter((p) => {
    if (p.product_type === 'custom_box') return false;
    
    // Check if the admin explicitly configured this item
    const bundleConfig = mixMatchProduct?.bundle_items?.find(bi => bi.id === p.id);
    if (isPartyTray && bundleConfig) {
      if (bundleConfig.quantity === 0) return false; // Explicitly excluded
      return true; // Explicitly included
    }

    // Default logic for party trays and mix match boxes
    if (p.category !== 'dry-sweets') return false;
    if (isPartyTray && excludedForPartyTray.includes(p.slug)) return false;
    return true;
  });

  // Initialize/Reset selections when product changes or box size changes
  useEffect(() => {
    if (mixMatchProduct) {
      fetchCatalog(true);
      if (mixMatchProduct.category === 'dry-sweets') {
        // Start with 1 of the clicked sweet
        setSelections({
          [mixMatchProduct.id]: 1
        });
      } else {
        setSelections({});
      }
      setBoxQuantity(1);
    } else {
      setSelections({});
      setBoxQuantity(1);
    }
  }, [mixMatchProduct, fetchCatalog]);

  if (!mixMatchProduct) return null;

  const currentTotal = Object.values(selections).reduce((acc, qty) => acc + qty, 0);
  const isBoxFull = isPartyTray ? (currentTotal > 0 && currentTotal <= 5) : (currentTotal === activeBoxSize);

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
    if (delta > 0 && currentTotal >= activeBoxSize) return;

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

    addToCart({
      productId: isPartyTray ? mixMatchProduct.id : `mixmatch-${activeBoxSize}`,
      name: isPartyTray ? mixMatchProduct.name : `${activeBoxSize} Pcs Mix & Match Box`,
      price: activePrice,
      quantity: boxQuantity,
      image: isPartyTray ? (mixMatchProduct.images[0] || '') : BOX_IMAGES[activeBoxSize as 3|6|9],
      unit: mixMatchProduct.unit || 'Custom Assortment',
      mixMatch: {
        size: activeBoxSize as any,
        price: activePrice,
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
              {!isPartyTray && (
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
              )}

              {/* Sweet Selector Section */}
              <div>
                <div className="flex justify-between items-center border-b border-border pb-2.5 mb-4">
                  <span className="font-cinzel text-xs uppercase tracking-wider text-primary-deep font-semibold">
                    {isPartyTray ? '1.' : '2.'} Select Sweets {isPartyTray ? '(Max 5 items)' : `(${currentTotal} of ${activeBoxSize} pcs)`}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded font-cinzel ${isBoxFull ? 'bg-primary text-white' : 'bg-blush text-primary'}`}>
                    {isPartyTray 
                      ? (currentTotal > 0 ? `${currentTotal}/5 Selected` : 'Select up to 5') 
                      : (isBoxFull ? 'Box Filled!' : `${activeBoxSize - currentTotal} remaining`)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {drySweets.map((sweet) => {
                    const count = selections[sweet.id] || 0;
                    const isOutOfStock = !sweet.inStock;
                    return (
                      <div
                        key={sweet.id}
                        className={`p-3 bg-white rounded-lg border flex items-center justify-between transition-all duration-200 ${
                          count > 0 ? 'border-primary/60 shadow-sm' : 'border-border'
                        } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            <span className="text-[10px] text-brown font-body line-clamp-1 mt-0.5">
                              {isOutOfStock ? 'Out of Stock' : sweet.description}
                            </span>
                          </div>
                        </div>

                        {/* Adjuster */}
                        {isPartyTray ? (
                          <button
                            disabled={isOutOfStock}
                            onClick={() => {
                              const isSelected = !!selections[sweet.id];
                              if (isSelected) {
                                setSelections({ ...selections, [sweet.id]: 0 });
                              } else {
                                if (currentTotal >= 5) return;
                                setSelections({ ...selections, [sweet.id]: 1 });
                              }
                            }}
                            className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                              selections[sweet.id]
                                ? 'bg-primary border-primary text-white'
                                : isOutOfStock
                                ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-300'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                          >
                            {!!selections[sweet.id] && <Check className="w-4 h-4" />}
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2 bg-cream/30 border border-border rounded">
                            <button
                              onClick={() => updateSweetQty(sweet.id, -1)}
                              disabled={count === 0 || isOutOfStock}
                              className={`p-1.5 transition-colors ${
                                count === 0 || isOutOfStock ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:text-accent'
                              }`}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-semibold w-4 text-center text-primary-deep font-cinzel">
                              {count}
                            </span>
                            <button
                              onClick={() => updateSweetQty(sweet.id, 1)}
                              disabled={isBoxFull || isOutOfStock}
                              className={`p-1.5 transition-colors ${
                                isBoxFull || isOutOfStock ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:text-accent'
                              }`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}
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
                  ${activePrice * boxQuantity}.00
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#FAF6F0] border border-[#E8C8C8] rounded-lg px-2 py-1.5 h-[48px]">
                  <button onClick={() => setBoxQuantity(Math.max(1, boxQuantity - 1))} className="p-0.5 text-primary">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-primary-deep font-cinzel w-6 text-center select-none">{boxQuantity}</span>
                  <button onClick={() => setBoxQuantity(boxQuantity + 1)} className="p-0.5 text-primary">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddBoxToCart}
                  disabled={!isBoxFull}
                  className={`h-[48px] px-8 text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
                    isBoxFull
                      ? 'btn-gold shadow-md'
                      : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isBoxFull && <Check className="h-4 w-4 mr-1 text-accent" />}
                  <span>{isPartyTray ? (isBoxFull ? 'Add To Cart' : 'Select at least 1') : (isBoxFull ? 'Add To Cart' : `Fill Box (${activeBoxSize - currentTotal} left)`)}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
