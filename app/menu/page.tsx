'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, ShoppingBag, Plus, Minus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Product } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/app/store/useCart';
import { useCatalog } from '@/app/store/useCatalog';

// Dynamic category pills will be generated inside the component

// ─── Product Quick Modal ──────────────────────────────────────────────────────
function ProductQuickModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const minQty = product.minOrderQty || 1;
  const [quantity, setQuantity] = useState(minQty);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      unit: product.unit,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const isFree = product.price === 0;
  const displayPrice = isFree ? 'Price varies' : `$${product.price.toFixed(2)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative z-10 w-full sm:max-w-md bg-cream rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/80 text-primary-deep hover:bg-blush transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative w-full aspect-[4/3] bg-blush overflow-hidden">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, 448px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/40 font-subheading text-sm">Mithai</div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="px-4 py-2 border-2 border-primary text-primary font-subheading text-xs font-bold uppercase tracking-widest bg-cream rounded">Sold Out</span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg text-primary-deep font-extrabold leading-tight">{product.name}</h3>
              {product.unit && (
                <p className="text-[10px] text-brown font-body font-semibold mt-0.5 uppercase tracking-wider">{product.unit}</p>
              )}
            </div>
            <span className="font-cinzel text-base text-accent font-bold shrink-0">{displayPrice}</span>
          </div>

          <p className="text-xs text-primary-deep/80 font-body leading-relaxed">{product.description}</p>

          {product.minOrderQty && (
            <p className="text-[10px] text-brown font-cinzel uppercase tracking-wider border border-border rounded px-2.5 py-1.5 bg-white">
              Minimum order: {product.minOrderQty} pcs
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
              <button onClick={() => setQuantity((q) => Math.max(minQty, q - 1))} className="px-3 py-2.5 text-primary hover:bg-blush/40 transition-colors">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="px-4 text-sm font-cinzel font-bold text-primary-deep min-w-[2.5rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2.5 text-primary hover:bg-blush/40 transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock || isFree}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest font-cinzel font-bold rounded-lg transition-all duration-200 ${
                added ? 'bg-green-600 text-white'
                  : !product.inStock || isFree ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'btn-gold text-primary-deep'
              }`}
            >
              {added ? <>Added ✓</> : <><ShoppingCart className="h-3.5 w-3.5" />Add to Cart</>}
            </button>
          </div>

          {isFree && (
            <p className="text-[10px] text-brown font-body text-center">
              This item must be ordered through the Mix &amp; Match tab.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Compact Mobile Card (2-col grid) ────────────────────────────────────────
function MobileProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: (p: Product) => void;
}) {
  const isFree = product.price === 0;

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm text-left w-full active:scale-95 transition-transform duration-150 ${!product.inStock ? 'opacity-70' : ''}`}
    >
      {/* Image — compact square */}
      <div className="relative w-full aspect-square bg-blush overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover group-active:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/40 text-[10px] font-cinzel">Mishti</div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <span className="px-2 py-1 border border-primary text-primary font-cinzel text-[9px] font-bold uppercase tracking-wider bg-cream rounded">Sold Out</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <h3 className="font-cinzel text-[11px] text-primary-deep font-bold leading-tight line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-cinzel text-xs text-accent font-bold">
            {isFree ? '$5–$15' : `$${product.price.toFixed(2)}`}
          </span>
          <span className="p-1 rounded-full bg-primary/10 text-primary">
            <ShoppingCart className="h-3 w-3" />
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Desktop Card (original) ──────────────────────────────────────────────────
function MenuProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: (p: Product) => void;
}) {
  const categoryLabel: Record<string, string> = {
    'dry-sweets': 'Mix & Match',
    specialty: 'Specialty',
    'party-trays': 'Party Tray',
    pitha: 'Pitha',
    'mishti-per-pound': 'Per Pound',
  };
  const isFree = product.price === 0;

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className={`group relative premium-card flex flex-col h-full overflow-hidden w-full text-left transition-transform duration-200 hover:-translate-y-0.5 ${!product.inStock ? 'opacity-70' : ''}`}
    >
      <div className="aspect-square w-full relative bg-blush overflow-hidden">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/45 font-subheading text-xs">Mishti</div>
        )}
        <div className="absolute inset-0 bg-primary-deep/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-3 py-1.5 bg-white/90 rounded-full text-primary-deep text-[10px] font-cinzel font-bold uppercase tracking-wider shadow translate-y-2 group-hover:translate-y-0 transition-transform duration-300">View &amp; Add</span>
        </div>
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-0.5 text-[9px] font-cinzel font-bold uppercase tracking-wider bg-primary-deep text-cream rounded shadow-sm border border-accent/20">
            {categoryLabel[product.category] ?? product.category}
          </span>
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <span className="px-4 py-2 border-2 border-primary text-primary font-subheading text-xs font-bold uppercase tracking-widest bg-cream shadow-md rounded">Sold Out</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          <h3 className="font-cinzel text-sm text-primary-deep group-hover:text-primary transition-colors duration-200 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-brown font-body line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div className="flex flex-col">
            {product.unit && <span className="text-[10px] text-brown font-semibold">{product.unit}</span>}
            <span className="font-cinzel text-base text-accent font-bold mt-0.5">{isFree ? '$5 – $15' : `$${product.price.toFixed(2)}`}</span>
          </div>
          <span className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
            <ShoppingCart className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Main Catalog ─────────────────────────────────────────────────────────────
function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dedicated ref for the MOBILE pill bar only
  const mobilePillsRef = useRef<HTMLDivElement>(null);
  // Refs for each category section (mobile)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  // Track if we're programmatically scrolling (to prevent feedback loop)
  const isScrollingRef = useRef(false);

  const { openCollectionModal, openMixMatch } = useCart();
  const { products: PRODUCTS, categories, fetchCatalog, isLoading } = useCatalog();

  const CATEGORY_PILLS = categories
    .filter((c: any) => c.is_active)
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((c: any) => ({
      id: c.slug,
      label: c.name,
      filterKey: c.slug
    }));

  useEffect(() => {
    fetchCatalog(true);
  }, [fetchCatalog]);

  // Sync active tab from URL or default to first category when catalog loads
  useEffect(() => {
    if (CATEGORY_PILLS.length === 0) return;
    const urlCategory = searchParams.get('category');
    const match = CATEGORY_PILLS.find((p) => p.filterKey === urlCategory);
    const currentIsValid = CATEGORY_PILLS.find(p => p.id === activeTab);
    // Set active tab if: url param exists, or current tab is invalid/empty
    if (urlCategory || !currentIsValid) {
      setActiveTab(match ? match.id : CATEGORY_PILLS[0].id);
    }
  }, [searchParams, CATEGORY_PILLS.length]);

  // Scroll the MOBILE pill bar so the active pill is centered — uses mobilePillsRef only
  useEffect(() => {
    const container = mobilePillsRef.current;
    if (!container) return;
    const activePill = container.querySelector('[data-active="true"]') as HTMLElement;
    if (!activePill) return;
    const targetScrollLeft =
      activePill.offsetLeft - container.clientWidth / 2 + activePill.offsetWidth / 2;
    container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
  }, [activeTab]);

  // IntersectionObserver — update active pill as user scrolls mobile sections
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 640) return;

    const observers: IntersectionObserver[] = [];

    CATEGORY_PILLS.forEach((pill) => {
      const el = sectionRefs.current[pill.id];
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveTab(pill.id);
          }
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [PRODUCTS]);

  const handlePillClick = (pill: (typeof CATEGORY_PILLS)[number]) => {
    setActiveTab(pill.id);
    router.replace(`/menu?category=${pill.filterKey}`, { scroll: false });

    // On mobile — smooth scroll to section
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      const el = sectionRefs.current[pill.id];
      if (el) {
        isScrollingRef.current = true;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { isScrollingRef.current = false; }, 800);
      }
      return;
    }
  };

  const baseFilter = (product: Product) =>
    product.product_type !== 'selection_item' && !product.slug.startsWith('assorted');

  const getFilteredProducts = (filterKey: string) =>
    PRODUCTS.filter((p) => baseFilter(p) && p.category === filterKey &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())));

  // Desktop: single filtered list
  const activeFilterKey = CATEGORY_PILLS.find((p) => p.id === activeTab)?.filterKey ?? CATEGORY_PILLS[0]?.filterKey ?? '';
  const desktopFilteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = product.category === activeFilterKey;
    return matchesSearch && matchesCategory && baseFilter(product);
  });

  const handleProductClick = (product: Product) => {
    if (product.slug === 'mixmatch-3') openCollectionModal('dry-sweets', 3);
    else if (product.slug === 'mixmatch-6') openCollectionModal('dry-sweets', 6);
    else if (product.slug === 'mixmatch-9') openCollectionModal('dry-sweets', 9);
    else if (product.category === 'party-trays') openMixMatch(product);
    else setSelectedProduct(product);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-cinzel text-xs uppercase tracking-wider text-brown">Loading Sweet Catalog...</p>
      </div>
    );
  }


  return (
    <>
      {/* ── MOBILE LAYOUT (< sm) ─────────────────────────────────────────── */}
      <div className="sm:hidden flex flex-col min-h-screen">
        {/* Sticky header + pill nav */}
        <div className="sticky top-0 z-30 bg-cream/95 backdrop-blur-md border-b border-border shadow-sm px-4 pt-4 pb-3 space-y-3">
          <div>
            <h1 className="font-heading text-2xl text-primary font-extrabold tracking-tight">Our Mithai</h1>
            <p className="text-[11px] text-brown font-body">Authentic sweets, handcrafted fresh to order.</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brown" />
            <input
              type="text"
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-border rounded-lg text-primary-deep placeholder-brown/60 font-body focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-brown">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Mobile pill bar — has its own ref so scrollTo targets it directly */}
          <div ref={mobilePillsRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORY_PILLS.map((pill) => {
              const isActive = activeTab === pill.id;
              return (
                <button
                  key={pill.id}
                  data-active={isActive ? 'true' : 'false'}
                  onClick={() => handlePillClick(pill)}
                  className={`shrink-0 inline-flex items-center px-4 py-2 rounded-full text-xs font-cinzel font-bold uppercase tracking-wider transition-all duration-200 border shadow-sm ${
                    isActive
                      ? 'bg-primary-deep text-cream border-primary-deep shadow-md'
                      : 'bg-white text-primary-deep border-border hover:border-primary hover:bg-blush/30'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable category sections */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-8 pt-5">
          {CATEGORY_PILLS.map((pill) => {
            const products = getFilteredProducts(pill.filterKey);
            return (
              <section
                key={pill.id}
                ref={(el) => { sectionRefs.current[pill.id] = el; }}
                id={`section-${pill.id}`}
              >
                {/* Section header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border" />
                  <h2 className="font-cinzel text-[11px] font-bold uppercase tracking-widest text-primary-deep px-2">{pill.label}</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {products.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-xs text-brown font-body">No items found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {products.map((product) => (
                      <MobileProductCard key={product.id} product={product} onClick={handleProductClick} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (≥ sm) ────────────────────────────────────────── */}
      <div className="hidden sm:block max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Page Title */}
          <div className="flex flex-col space-y-2 border-b border-border pb-6">
            <h1 className="font-heading text-4xl text-primary font-extrabold tracking-tight">Our Mithai Catalog</h1>
            <p className="text-sm text-brown font-body">
              Explore our collection of authentic sweets, custom boxes, and savory treats, handcrafted fresh to order.
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown" />
            <input
              type="text"
              placeholder="Search sweet names or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-border rounded-lg text-primary-deep placeholder-brown/60 font-body focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-blush/50 text-brown hover:text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Desktop pill nav — no auto-scroll ref needed */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORY_PILLS.map((pill) => {
              const isActive = activeTab === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => handlePillClick(pill)}
                  className={`shrink-0 inline-flex items-center px-4 py-2 rounded-full text-xs font-cinzel font-bold uppercase tracking-wider transition-all duration-200 border shadow-sm ${
                    isActive
                      ? 'bg-primary-deep text-cream border-primary-deep shadow-md'
                      : 'bg-white text-primary-deep border-border hover:border-primary hover:bg-blush/30'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Desktop grid */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {desktopFilteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-12 bg-white rounded-xl border border-border shadow-sm flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center text-primary">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base text-primary-deep font-bold">No sweets found</h3>
                    <p className="text-xs text-brown font-body mt-1 max-w-sm">Try a different keyword or category.</p>
                  </div>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveTab(CATEGORY_PILLS[0]?.id ?? ''); router.replace('/menu'); }}
                    className="btn-gold py-2 px-5 text-[10px] uppercase tracking-widest"
                  >
                    Show All
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {desktopFilteredProducts.map((product) => (
                    <motion.div layout key={product.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                      <MenuProductCard product={product} onClick={handleProductClick} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Product Quick Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductQuickModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default function ProductCatalog() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-cinzel text-xs uppercase tracking-wider text-brown">Loading Sweet Catalog...</p>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
