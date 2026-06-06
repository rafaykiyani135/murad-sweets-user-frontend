'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/store/useCart';
import { Product } from '@/app/data/products';
import { Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openMixMatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.category === 'dry-sweets') {
      openMixMatch(product);
    } else {
      // Default to minimum order qty if specified (e.g. 10 for Pitha)
      const qty = product.minOrderQty || 1;
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.images[0],
        unit: product.unit
      });
    }
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
    <Link
      href={`/products/${product.slug}`}
      className={`group relative premium-card flex flex-col h-full overflow-hidden ${!product.inStock ? 'opacity-70' : ''
        }`}
    >
      {/* Product Image Wrapper */}
      <div className="aspect-square w-full relative bg-blush overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/45 font-subheading">
            Mishti
          </div>
        )}

        {/* Hover overlay with a view details icon */}
        <div className="absolute inset-0 bg-primary-deep/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="p-2.5 bg-white/95 rounded-full text-primary-deep shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="h-5 w-5" />
          </span>
        </div>

        {/* Category Badging */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <span className="px-2 py-0.5 text-[9px] font-subheading font-bold uppercase tracking-wider bg-primary-deep text-cream rounded shadow-sm border border-accent/20">
            {getCategoryLabel(product.category)}
          </span>
          {product.preOrderOnly && (
            <span className="px-2 py-0.5 text-[9px] font-subheading font-bold uppercase tracking-wider bg-accent text-primary-deep rounded shadow-sm">
              Pre-Order
            </span>
          )}
        </div>

        {/* Sold Out Overlay State */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <span className="px-4 py-2 border-2 border-primary text-primary font-subheading text-xs font-bold uppercase tracking-widest bg-cream shadow-md rounded">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          <h3 className="font-cinzel text-sm text-primary-deep group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-brown font-body line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 flex items-end justify-between">
          <div className="flex flex-col">
            {product.category === 'dry-sweets' ? (
              <span className="text-[10px] text-brown font-semibold uppercase tracking-wider">
                Mix & Match Boxes
              </span>
            ) : (
              <span className="text-xs text-brown font-semibold">
                {product.unit || 'per box'}
              </span>
            )}
            <span className="font-cinzel text-base text-accent font-bold mt-0.5">
              {product.category === 'dry-sweets' ? '$5 – $15' : `$${product.price.toFixed(2)}`}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-200 ${!product.inStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-accent hover:text-primary-deep shadow-sm'
              }`}
            aria-label={product.category === 'dry-sweets' ? 'Select options' : 'Add to cart'}
          >
            {product.category === 'dry-sweets' ? (
              <span className="text-[10px] font-subheading uppercase font-semibold px-2">
                Configure
              </span>
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
