'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import CategoryShowcase from '@/components/CategoryShowcase';

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-cream">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-start pt-28 pb-12 md:py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/HeroSectionImageVersion2.png"

            alt="Murad Sweets Background"
            fill
            priority
            className="hidden sm:block object-cover object-center"
          />
          <Image
            src="/HeroSectionPhoneViewVersion3.png"
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



      {/* 7. TESTIMONIALS */}
      <section className="relative py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <span className="font-script text-accent text-3xl">Sweet Feedback</span>
            <h2 className="font-heading text-3xl sm:text-4xl text-primary font-extrabold tracking-tight">
              Loved By Our Community
            </h2>
            <p className="text-xs sm:text-sm text-brown font-body">
              Read real 5-star experiences from our verified Google Maps customers in Houston.
            </p>
          </div>

          {/* Overall Rating Summary Card */}
          <div className="bg-white/60 backdrop-blur-sm border border-border p-4 rounded-xl flex items-center gap-4 self-start shadow-sm">
            <div className="text-center pr-4 border-r border-border">
              <span className="block font-heading text-3xl font-black text-primary-deep leading-none">5.0</span>
              <span className="text-[10px] uppercase tracking-wider text-brown font-semibold mt-1 block">Rating</span>
            </div>
            <div>
              <div className="flex space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent stroke-accent" />
                ))}
              </div>
              <span className="text-[11px] text-primary-deep font-body mt-1 block font-medium">
                Based on Google Reviews
              </span>
              <a
                href="https://www.google.com/search?kgmid=/g/11zj1x7w1s&hl=en-US&q=Murad+Sweets+-+Bangladeshi+Mishti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-accent hover:text-primary-deep font-bold uppercase tracking-wider underline mt-1 block transition-colors"
              >
                Write a Review
              </a>
            </div>
          </div>
        </div>

        <div className="flex w-full overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory">
          {[
            {
              name: "Fazzarna Rabbi",
              text: "Best Bangladeshi mishti (sweets) in Houston, TX!! Very nice and secured packaging to be presented as gifts!! 10/10 highly recommend.",
              date: "2 weeks ago"
            },
            {
              name: "Nowrin B Amin",
              text: "By far the BEST Bangladeshi sweets I ever had in Houston. The flavor, texture, juiciness it's perfectly done. The price is very reasonable as well. They also do fancy packaging and platter for parties. Look no further just go support this small business. 10/10 all the way!!!!",
              date: "4 months ago"
            },
            {
              name: "Samara Hossain",
              text: "Has a wide selection of homemade Bangladeshi sweets that are fresh and delicious. I especially enjoyed the Kalojam sandwich.",
              date: "2 months ago"
            },
            {
              name: "Umama Noor",
              text: "THE BEST mishti i've ever had اللهم بارك So authentic and so fresh!! Couldn't stop myself from having more. Every bite just melts in your mouth and brings you back to your childhood! You can definitely tell it's made with love!! The owners are the nicest people ever! May الله swt put barakah in their business!",
              date: "4 months ago"
            },
            {
              name: "Md Nabil Ahsan",
              text: "Amazing and authentic Bangldeshi sweets. Will be ordering a lot in the coming months",
              date: "3 months ago"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[85vw] sm:w-[380px] bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300 relative group snap-start"
            >
              <div className="space-y-3">
                {/* Header: Stars & Google Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-accent stroke-accent" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="text-[9px] uppercase font-cinzel font-semibold tracking-wider text-brown">
                      Google Review
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-primary-deep font-body italic leading-relaxed font-medium">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center justify-between border-t border-border/40 pt-3 flex-wrap gap-2">
                <span className="text-[10px] text-brown font-body">
                  {item.date}
                </span>
                <span className="block font-cinzel text-xs text-accent font-bold uppercase tracking-wider">
                  &mdash; {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
