'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Plus, Minus, ShoppingCart, Info, AlertTriangle } from 'lucide-react';
import { useCatalog } from '@/app/store/useCatalog';
import { useCart } from '@/app/store/useCart';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, openMixMatch } = useCart();
  
  const { products: PRODUCTS, fetchCatalog, isLoading } = useCatalog();
  
  const slug = params.slug as string;

  useEffect(() => {
    fetchCatalog(true);
  }, [fetchCatalog]);

  // Find the product by slug
  const product = PRODUCTS.find((p) => p.slug === slug);

  // States
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Set default quantity according to minimum order requirement
  useEffect(() => {
    if (product) {
      if (product.minOrderQty) {
        setQuantity(product.minOrderQty);
      } else {
        setQuantity(1);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-cinzel text-xs uppercase tracking-wider text-brown">
          Loading Sweet Details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="font-heading text-2xl text-primary font-bold">Product Not Found</h2>
        <p className="text-sm text-brown font-body">
          We couldn&apos;t find the traditional sweet you are looking for. It may have been renamed or removed.
        </p>
        <Link href="/menu" className="inline-flex btn-gold py-2 px-6 text-xs uppercase tracking-widest">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Related products (same category, max 3 cards, excluding current product)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id && p.inStock
  ).slice(0, 3);

  // Handlers
  const handleQtyChange = (delta: number) => {
    const minQty = product.minOrderQty || 1;
    const newQty = quantity + delta;
    if (newQty >= minQty) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (product.category === 'dry-sweets' || product.category === 'party-trays') {
      openMixMatch(product);
      return;
    }

    setIsAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[activeImageIdx] || product.images[0],
      unit: product.unit
    });

    // Animate button feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'dry-sweets': return 'Dry Sweets';
      case 'specialty': return 'Specialty';
      case 'party-trays': return 'Party Tray';
      case 'pitha': return 'Pitha';
      default: return cat;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-xs font-cinzel font-bold text-brown hover:text-primary transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
      </div>

      {/* Main product detail container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative w-full rounded-xl overflow-hidden bg-blush border border-border">
            {product.images[activeImageIdx] ? (
              <Image
                src={product.images[activeImageIdx]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary/40 font-subheading">
                Mithai Image
              </div>
            )}
            
            {/* Badges on detail image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-2.5 py-1 text-[10px] font-subheading font-bold uppercase tracking-wider bg-primary-deep text-cream rounded shadow border border-accent/20">
                {getCategoryLabel(product.category)}
              </span>
              {product.preOrderOnly && (
                <span className="px-2.5 py-1 text-[10px] font-subheading font-bold uppercase tracking-wider bg-accent text-primary-deep rounded shadow">
                  Pre-Order Only
                </span>
              )}
            </div>
            
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                <span className="px-4 py-2 border-2 border-primary text-primary font-subheading text-sm font-bold uppercase tracking-widest bg-cream shadow-md rounded">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip (if multiple images exist, or show mock thumbnails) */}
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-20 h-20 rounded-md overflow-hidden bg-blush border-2 transition-all ${
                  activeImageIdx === idx ? 'border-primary shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-6">
          <div className="space-y-2 border-b border-border pb-4">
            <h1 className="font-heading text-2xl sm:text-3xl text-primary font-extrabold tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center justify-between">
              <span className="font-cinzel text-xl text-accent font-bold">
                {product.category === 'dry-sweets' ? '$5 – $15' : `$${product.price.toFixed(2)}`}
              </span>
              <span className="text-xs text-brown font-semibold font-body">
                {product.category === 'dry-sweets' ? 'Varies by box size' : product.unit || 'per unit'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-primary-deep font-body leading-relaxed">
            {product.description}
          </p>

          {/* Traditional Pitha Warning Notice */}
          {product.minOrderQty && (
            <div className="p-3.5 bg-blush/40 border border-accent/30 rounded-lg flex items-start space-x-2.5">
              <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary font-cinzel">Pre-Order Minimum Required</p>
                <p className="text-[11px] text-primary-deep font-body mt-0.5">
                  Traditional pitha is made fresh to order. A minimum quantity of **{product.minOrderQty} pieces** is required to complete preparation.
                </p>
              </div>
            </div>
          )}

          {/* Pre-Order Banner details */}
          {product.preOrderOnly && (
            <div className="p-3.5 bg-cream border border-border rounded-lg flex items-start space-x-2.5">
              <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary-deep font-cinzel">Pre-Order Schedule</p>
                <p className="text-[11px] text-brown font-body mt-0.5">
                  Fulfillment is scheduled during checkout. Allow a minimum of **24–48 hours** for preparation. Same-day fulfillment is not available.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4 pt-4 border-t border-border">
            {product.inStock && product.category !== 'dry-sweets' && product.category !== 'party-trays' && (
              <div className="flex items-center space-x-4">
                <span className="font-cinzel text-xs uppercase tracking-wider text-brown font-semibold">
                  Quantity
                </span>
                
                <div className="flex items-center bg-cream/30 border border-border rounded-lg">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    className="p-2 text-primary hover:text-accent transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-semibold w-8 text-center text-primary-deep font-cinzel">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(1)}
                    className="p-2 text-primary hover:text-accent transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all ${
                !product.inStock
                  ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                  : 'btn-gold shadow-md text-white'
              }`}
            >
              {product.category === 'dry-sweets' || product.category === 'party-trays' ? (
                <>
                  <span>
                    {product.category === 'party-trays'
                      ? `Customize Your ${product.name}`
                      : 'Configure Mix & Match Box'}
                  </span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  <span>{isAdding ? 'Adding to Cart...' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Strip */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="border-b border-border pb-3.5">
            <h2 className="font-heading text-xl text-primary font-bold">Related Sweets</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
