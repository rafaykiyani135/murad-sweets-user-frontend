'use client';

import Image from 'next/image';
import { useCart } from '@/app/store/useCart';
import type { Product } from '@/app/data/products';

const items = [
  {
    id: 'dry-sweets',
    title: 'Dry Sweets',
    description: 'Timeless favorites made with the finest nuts, khoya and traditional recipes. Perfect for every occasion.',
    features: [],
    iconImage: '/Icons/IconRowTwo.png',
    image: '/MithayiBox1.png',
    type: 'image-row'
  },
  {
    id: 'party-trays',
    title: 'Party Trays',
    description: 'Beautifully arranged trays for weddings, gatherings and celebrations. Made to impress.',
    features: [],
    iconImage: '/Icons/IconRowThree.png',
    image: '/MithayiBox2.png',
    type: 'image-row'
  },
  {
    id: 'specialty',
    title: 'Specialty Items',
    description: 'Indulge in our rich and premium specialty sweets made for true sweet lovers.',
    features: [],
    iconImage: '/Icons/IconRow4.png',
    image: '/MithayiBox3.png',
    type: 'image-row'
  },
  {
    id: 'pitha',
    title: 'Traditional Pitha',
    description: 'A taste of heritage. Traditional Bangladeshi pitha made the authentic way, just like home.',
    features: [],
    iconImage: '/Icons/IconRowOne.png',
    image: '/MithayiBox4.png',
    type: 'image-row'
  }
];

function CategoryIcon({ id, className }: { id: string; className?: string }) {
  if (id === 'dry-sweets') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 12c-3-3-4-8-4-8s5 1 8 4c3-3 8-4 8-4s-1 5-4 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22v-6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    );
  }
  if (id === 'party-trays') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 12v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 12H2M12 22V12M12 7c-2 0-3-2-3-3s1-2 3-2 3 2 3 3-1 2-3 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7c2 0 3-2 3-3s-1-2-3-2-3 2-3 3 1 2 3 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12V7a1 1 0 011-1h14a1 1 0 011 1v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === 'specialty') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 10c0 4.418 3.582 8 8 8s8-3.582 8-8H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18v4M8 22h8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="7" r="3" />
        <circle cx="16" cy="7" r="3" />
        <circle cx="12" cy="4" r="3" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}

function FeatureList({ type, iconImage }: { type: string; features: string[]; iconImage?: string }) {
  if (type === 'image-row' && iconImage) {
    return (
      <div className="w-full relative h-[140px] sm:h-[180px] md:h-[220px]">
        <Image 
          src={iconImage} 
          alt="Category Icons" 
          fill 
          className="object-contain mix-blend-multiply object-left" 
        />
      </div>
    );
  }

  return null;
}

export default function CategoryShowcase() {
  const { openCollectionModal } = useCart();

  return (
    <section className="bg-[#FFF9F5] pt-20 overflow-hidden">
      <header className="max-w-[1600px] mx-auto text-center mb-16 flex flex-col items-center px-4">
        <svg className="w-6 h-6 text-[#c97d4e] mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22C12 22 9 17 9 12C9 7 12 2 12 2Z" />
          <path d="M22 12C22 12 17 15 12 15C7 15 2 12 2 12C2 12 7 9 12 9C17 9 22 12 22 12Z" />
        </svg>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#541523] mb-4">
          Our Sweet<br />Collections
        </h2>
        <svg className="w-6 h-6 text-[#c97d4e] mt-2 rotate-180" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22C12 22 9 17 9 12C9 7 12 2 12 2Z" />
          <path d="M22 12C22 12 17 15 12 15C7 15 2 12 2 12C2 12 7 9 12 9C17 9 22 12 22 12Z" />
        </svg>
        <p className="mt-8 text-[#541523]/80 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Handcrafted with tradition, made fresh with premium ingredients, and shared with love.
        </p>
      </header>

      <div className="flex flex-col w-full">
        {items.map((item, index) => {
          const imageLeft = index % 2 === 1; // 0: Right, 1: Left, 2: Right, 3: Left
          return (
            <div key={item.id} className={`flex flex-col ${imageLeft ? 'md:flex-row-reverse' : 'md:flex-row'} w-full bg-[#FFF4EE]`}>
              {/* Text content */}
              <div className="w-full md:w-1/2 flex flex-col justify-center py-16 px-6 sm:px-12 lg:px-24 xl:px-32 relative">
                <div className="max-w-xl w-full mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-[#FCE5D8] flex items-center justify-center text-[#681628] shadow-sm">
                      <CategoryIcon id={item.id} className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#541523]">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-[#541523]/80 text-lg sm:text-xl leading-relaxed mb-10 font-medium">
                    {item.description}
                  </p>

                  <div className="mb-12">
                    <FeatureList type={item.type} features={item.features} iconImage={item.iconImage} />
                  </div>

                  <button
                    type="button"
                    onClick={() => openCollectionModal(item.id as Product['category'])}
                    className="inline-flex items-center justify-center gap-3 bg-[#681628] text-white px-8 py-3.5 rounded hover:bg-[#541523] transition-colors font-semibold tracking-wide text-sm sm:text-base w-fit shadow-md hover:shadow-lg"
                  >
                    Explore Collection
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  quality={100}
                  sizes="100vw"
                  priority={index <= 1} // Prioritize loading for the first two images
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

