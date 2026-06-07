'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import CategoryShowcase from '@/components/CategoryShowcase';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-cream">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-start pt-28 pb-12 md:py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/HeroSectionImage.png"
            alt="Murad Sweets Background"
            fill
            priority
            className="hidden sm:block object-cover object-center"
          />
          <Image
            src="/HeroSectionImagePhone.png"
            alt="Murad Sweets Background Mobile"
            fill
            priority
            className="block sm:hidden object-cover object-center"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="w-[65%] sm:w-full max-w-2xl space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2 text-primary-deep">
                  <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="font-subheading text-sm font-bold tracking-widest uppercase">
                    Murad Sweets
                  </span>
                </div>
                <span className="font-subheading text-[10px] tracking-widest text-primary-deep uppercase ml-7">
                  Houston, Texas
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-[3.5rem] font-extrabold tracking-tight text-primary-deep leading-[1.1]">
                Authentic Bangladeshi<br />
                Mithai, Made with<br />
                Tradition &amp; Love
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-4"
            >
              <div className="w-12 h-[2px] bg-accent/60" />
              <p className="text-base sm:text-lg text-primary-deep font-body leading-relaxed max-w-md">
                Traditional recipes. <br /> Premium ingredients.<br />
                Handcrafted with care <br /> in Houston.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
            >
              <Link href="/menu" className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest text-cream shadow-lg bg-primary-deep border border-primary-deep hover:bg-primary transition-colors duration-300 flex items-center justify-center rounded-md font-subheading">
                <span>Order Now</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/menu" className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest text-primary-deep font-subheading border border-primary-deep hover:bg-primary-deep hover:text-cream transition-all duration-300 flex items-center justify-center rounded-md">
                Explore Sweets
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. BUSINESS STORY / ABOUT SECTION
      <section id="about" className="py-20 bg-white border-y border-border scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="flex flex-col items-center">
            <span className="font-script text-accent text-3xl mb-1">Our Heritage</span>
            <h2 className="font-heading text-3xl sm:text-4xl text-primary font-extrabold tracking-tight">
              The Murad Sweets Story
            </h2>
            <div className="w-16 h-[2px] bg-accent mt-4" />
          </div>
          <p className="text-sm sm:text-base text-primary-deep font-body leading-loose max-w-2xl mx-auto pt-2">
             Murad Sweets was born from a desire to share the rich culinary heritage of Bangladesh. Operating in Houston, we specialize in artisanal sweets (mithai) prepared using legacy family recipes...
          </p>
          <p className="text-xs text-brown font-cinzel font-semibold tracking-wider italic uppercase">
            &mdash; Preserving Traditions, One Sweet at a Time &mdash;
          </p>
        </div>
      </section> */}

      {/* 3. CATEGORY SHOWCASE (scroll rhythm) */}
      <CategoryShowcase />

      {/* 6. DELIVERY & PICKUP INFO BANNER */}
      <section className="py-12 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blush/40 border border-border rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
            {/* Delivery */}
            <div className="space-y-4 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-8">
              <div className="flex items-center space-x-3 text-primary">
                <MapPin className="h-6 w-6 text-accent flex-shrink-0" />
                <h3 className="font-cinzel text-base tracking-wider uppercase font-semibold">Delivery Coverage</h3>
              </div>
              <p className="text-xs sm:text-sm text-primary-deep font-body leading-relaxed">
                We deliver to select zip codes across **Brooklyn, Queens, and Manhattan** every Saturday and Sunday. Deliveries are scheduled by time slot (Morning, Afternoon, Evening) with a flat fee of **$5.00**.
              </p>
              <div className="text-xs text-brown">
                <span className="font-bold">Min Order for Delivery:</span> $20.00
              </div>
            </div>

            {/* Pickup */}
            <div className="space-y-4 md:pl-4">
              <div className="flex items-center space-x-3 text-primary">
                <Clock className="h-6 w-6 text-accent flex-shrink-0" />
                <h3 className="font-cinzel text-base tracking-wider uppercase font-semibold">Contactless Pickup</h3>
              </div>
              <p className="text-xs sm:text-sm text-primary-deep font-body leading-relaxed">
                Skip the delivery fee and collect directly from our home-based kitchen in **Brooklyn, NY 11218**. Pickups are available Friday through Sunday, 10:00 AM – 8:00 PM.
              </p>
              <div className="text-xs text-brown">
                <span className="font-bold">Pickup Instructions:</span> Provided via email and text message once order is approved.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="font-script text-accent text-3xl">Sweet Feedback</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-primary font-extrabold tracking-tight">
            Loved By Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              stars: 5,
              text: "The Kalojam sandwich is pure perfection! The malai filling is rich and not overly sweet, just like the elite mithai shops in Dhaka. I order a custom box every Eid.",
              name: "Nusrat"
            },
            {
              stars: 5,
              text: "I was skeptical about finding authentic pitha in New York, but Murad Sweets nailed the Patishapta. The crepes were soft, and the kheer filling was deeply flavorful. Highly recommended!",
              name: "Tanvir"
            },
            {
              stars: 5,
              text: "Amazing Rasmalai Cake! It was the star of my daughter's birthday. Perfect blend of a modern cake and traditional South Asian flavors. Order was ready right on time for pickup.",
              name: "Sultana"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex space-x-1">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent stroke-accent" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-primary-deep font-body italic leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>
              <span className="block font-cinzel text-xs text-accent font-bold uppercase tracking-wider text-right">
                &mdash; {item.name}.
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
