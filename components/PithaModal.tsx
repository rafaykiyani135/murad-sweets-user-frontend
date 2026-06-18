'use client';

import { useState } from 'react';
import { X, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCatalog } from '@/app/store/useCatalog';

export default function PithaModal() {
  const { isPithaModalOpen, closePithaModal, addToCart } = useCart();

  const { products } = useCatalog();
  const PITHA_ITEMS = products.filter((p) => p.category === 'pitha');

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (id: string) => quantities[id] || 1;
  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAddToCart = (item: any, quantity: number) => {
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.images[0] || '',
      unit: item.unit || '10pc box',
    });
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    closePithaModal();
  };

  if (!isPithaModalOpen) return null;

  return (
    <AnimatePresence>
      {isPithaModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
            onClick={closePithaModal}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
          />

          <div className="fixed inset-0 z-[61] flex items-end justify-center pointer-events-none">
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="pointer-events-auto w-full sm:max-w-2xl bg-[#FAF6F0] rounded-t-3xl border-t border-x border-[#E8C8C8] shadow-2xl flex flex-col overflow-hidden"
              style={{ maxHeight: '85vh' }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-[#E8C8C8]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8C8C8] bg-[#FFF4EE] shrink-0">
                <div>
                  <h2 className="text-base font-black tracking-tight text-[#1A1A1A] font-heading">
                    Traditional Pitha
                  </h2>
                  <p className="text-[11px] text-gray-500 font-body mt-0.5">
                    Authentic Bangladeshi pitha, made the traditional way.
                  </p>
                </div>
                <button onClick={closePithaModal} className="p-2 rounded-full text-primary-deep/60 hover:text-primary hover:bg-white/80 transition-colors" aria-label="Close modal">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable horizontal-card list */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {PITHA_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-white rounded-2xl border border-[#E8C8C8] shadow-sm overflow-hidden">
                    <div className="relative w-20 h-20 shrink-0">
                      <Image src={item.images[0] || ''} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0 py-2">
                      <h3 className="font-bold text-[13px] text-[#1A1A1A] font-heading leading-tight line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 line-clamp-1 font-body mt-0.5">{item.unit ? `${item.unit} · ` : ''}{item.description}</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-sm font-black text-primary font-cinzel">${item.price}.00</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pr-3 shrink-0">
                      <div className="flex items-center gap-1 bg-[#FAF6F0] border border-[#E8C8C8] rounded-lg px-1 py-1">
                        <button onClick={() => updateQty(item.id, -1)} disabled={getQty(item.id) <= 1} className="p-0.5 text-primary disabled:opacity-40">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-primary-deep font-cinzel w-5 text-center select-none">{getQty(item.id)}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-0.5 text-primary">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => handleAddToCart(item, getQty(item.id))} className="flex items-center gap-1 bg-[#681628] text-white px-3 py-2 rounded-lg font-bold text-[11px] hover:bg-[#541523] transition-colors shadow-sm">
                        <Check className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
