'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, ShoppingBag, Plus, Minus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { PRODUCTS, Product } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/app/store/useCart';

// ─── Category pill definitions ────────────────────────────────────────────────
const CATEGORY_PILLS: { id: string; label: string; filterKey: string | null }[] = [
  { id: 'all',              label: 'All',               filterKey: null },
  { id: 'dry-sweets',       label: 'Mix & Match',       filterKey: 'dry-sweets' },
  { id: 'party-trays',      label: 'Party Trays',       filterKey: 'party-trays' },
  { id: 'specialty',        label: 'Specialty Items',   filterKey: 'specialty' },
  { id: 'pitha',            label: 'Traditional Pitha', filterKey: 'pitha' },
  { id: 'mishti-per-pound', label: 'Mishti Per Pound',  filterKey: 'mishti-per-pound' },
  { id: 'single',           label: 'Single',            filterKey: 'specialty' },
];

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative z-10 w-full sm:max-w-md bg-cream rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/80 text-primary-deep hover:bg-blush transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Product Image */}
        <div className="relative w-full aspect-[4/3] bg-blush overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/40 font-subheading text-sm">
              Mithai
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="px-4 py-2 border-2 border-primary text-primary font-subheading text-xs font-bold uppercase tracking-widest bg-cream rounded">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Name & Price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg text-primary-deep font-extrabold leading-tight">
                {product.name}
              </h3>
              {product.unit && (
                <p className="text-[10px] text-brown font-body font-semibold mt-0.5 uppercase tracking-wider">
                  {product.unit}
                </p>
              )}
            </div>
            <span className="font-cinzel text-base text-accent font-bold shrink-0">
              {displayPrice}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-primary-deep/80 font-body leading-relaxed">
            {product.description}
          </p>

          {/* Min order notice */}
          {product.minOrderQty && (
            <p className="text-[10px] text-brown font-cinzel uppercase tracking-wider border border-border rounded px-2.5 py-1.5 bg-white">
              Minimum order: {product.minOrderQty} pcs
            </p>
          )}

          {/* Quantity + Add */}
          <div className="flex items-center gap-3 pt-1">
            {/* Quantity selector */}
            <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                className="px-3 py-2.5 text-primary hover:bg-blush/40 transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="px-4 text-sm font-cinzel font-bold text-primary-deep min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2.5 text-primary hover:bg-blush/40 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              disabled={!product.inStock || isFree}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest font-cinzel font-bold rounded-lg transition-all duration-200 ${
                added
                  ? 'bg-green-600 text-white'
                  : !product.inStock || isFree
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'btn-gold text-primary-deep'
              }`}
            >
              {added ? (
                <>Added ✓</>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add to Cart
                </>
              )}
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

// ─── Menu Product Card ────────────────────────────────────────────────────────
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
      className={`group relative premium-card flex flex-col h-full overflow-hidden w-full text-left transition-transform duration-200 hover:-translate-y-0.5 ${
        !product.inStock ? 'opacity-70' : ''
      }`}
    >
      {/* Image */}
      <div className="aspect-square w-full relative bg-blush overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/45 font-subheading text-xs">
            Mishti
          </div>
        )}

        {/* Tap to view hint */}
        <div className="absolute inset-0 bg-primary-deep/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-3 py-1.5 bg-white/90 rounded-full text-primary-deep text-[10px] font-cinzel font-bold uppercase tracking-wider shadow translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View &amp; Add
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-0.5 text-[9px] font-cinzel font-bold uppercase tracking-wider bg-primary-deep text-cream rounded shadow-sm border border-accent/20">
            {categoryLabel[product.category] ?? product.category}
          </span>
        </div>

        {/* Sold Out */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <span className="px-4 py-2 border-2 border-primary text-primary font-subheading text-xs font-bold uppercase tracking-widest bg-cream shadow-md rounded">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          <h3 className="font-cinzel text-sm text-primary-deep group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-brown font-body line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between pt-1">
          <div className="flex flex-col">
            {product.unit && (
              <span className="text-[10px] text-brown font-semibold">{product.unit}</span>
            )}
            <span className="font-cinzel text-base text-accent font-bold mt-0.5">
              {isFree ? '$5 – $15' : `$${product.price.toFixed(2)}`}
            </span>
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
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { openCollectionModal } = useCart();

  const MIX_MATCH_BOXES: Product[] = [
    {
      id: 'mix-match-3',
      slug: 'mix-match-3',
      name: '3-Piece Mix & Match Box',
      category: 'dry-sweets',
      description: 'Build your custom assorted box with 3 of your favorite traditional sweets.',
      price: 5,
      unit: '3 pcs',
      images: ['https://items-images-production-f.squarecdn.com/files/9ba888a143b397cf4ab2deda5c727d5bb80f8da9/original.jpeg?width=512&crop=1%3A1&format=webp'],
      inStock: true,
    },
    {
      id: 'mix-match-6',
      slug: 'mix-match-6',
      name: '6-Piece Mix & Match Box',
      category: 'dry-sweets',
      description: 'Build your custom assorted box with 6 of your favorite traditional sweets.',
      price: 10,
      unit: '6 pcs',
      images: ['https://items-images-production-f.squarecdn.com/files/fc1de58a35a7f9872d30cbc5cd86239cda863980/original.jpeg?width=512&crop=1%3A1&format=webp'],
      inStock: true,
    },
    {
      id: 'mix-match-9',
      slug: 'mix-match-9',
      name: '9-Piece Mix & Match Box',
      category: 'dry-sweets',
      description: 'Build your custom assorted box with 9 of your favorite traditional sweets.',
      price: 15,
      unit: '9 pcs',
      images: ['https://items-images-production-f.squarecdn.com/files/eac57c2d50106f70c33ea9f1caee98d15bf707e7/original.jpeg?width=512&crop=1%3A1&format=webp'],
      inStock: true,
    }
  ];

  // Sync from URL
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const match = CATEGORY_PILLS.find((p) => p.filterKey === urlCategory);
    setActiveTab(match ? match.id : 'all');
  }, [searchParams]);

  const handlePillClick = (pill: (typeof CATEGORY_PILLS)[number]) => {
    setActiveTab(pill.id);
    if (pill.filterKey) {
      router.replace(`/menu?category=${pill.filterKey}`);
    } else {
      router.replace('/menu');
    }
  };

  // Determine active filter key
  const activeFilterKey =
    CATEGORY_PILLS.find((p) => p.id === activeTab)?.filterKey ?? null;

  const allProductsWithBoxes = [
    ...PRODUCTS.filter((p) => p.category !== 'dry-sweets'),
    ...MIX_MATCH_BOXES,
  ];

  const filteredProducts = allProductsWithBoxes.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeFilterKey || product.category === activeFilterKey;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: Product) => {
    if (product.id === 'mix-match-3') openCollectionModal('dry-sweets', 3);
    else if (product.id === 'mix-match-6') openCollectionModal('dry-sweets', 6);
    else if (product.id === 'mix-match-9') openCollectionModal('dry-sweets', 9);
    else setSelectedProduct(product);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-6">
        {/* Page Title */}
        <div className="flex flex-col space-y-2 border-b border-border pb-6">
          <h1 className="font-heading text-3xl sm:text-4xl text-primary font-extrabold tracking-tight">
            Our Mithai Catalog
          </h1>
          <p className="text-xs sm:text-sm text-brown font-body">
            Explore our collection of authentic sweets, custom boxes, and savory treats,
            handcrafted fresh to order.
          </p>
        </div>

        {/* Search Bar */}
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
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-blush/50 text-brown hover:text-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Pill Buttons */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_PILLS.map((pill) => {
            const isActive = activeTab === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => handlePillClick(pill)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-cinzel font-bold uppercase tracking-wider transition-all duration-200 border shadow-sm ${
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

        {/* Grid */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 bg-white rounded-xl border border-border shadow-sm flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center text-primary">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base text-primary-deep font-bold">
                    No sweets found
                  </h3>
                  <p className="text-xs text-brown font-body mt-1 max-w-sm">
                    Try a different keyword or category.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                    router.replace('/menu');
                  }}
                  className="btn-gold py-2 px-5 text-[10px] uppercase tracking-widest"
                >
                  Show All
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MenuProductCard
                      product={product}
                      onClick={handleProductClick}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Product Quick Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductQuickModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
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
          <p className="font-cinzel text-xs uppercase tracking-wider text-brown">
            Loading Sweet Catalog...
          </p>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
