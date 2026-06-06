'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/app/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const { getCartCount, setCartOpen } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/#about' }, // anchors to section on homepage
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-deep md:bg-primary-deep/95 backdrop-blur-md border-b border-accent/30 py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 select-none">
                <Image
                  src="/murad-logo.jpg"
                  alt="Murad Sweets"
                  width={40}
                  height={40}
                  priority
                  className="h-10 w-10 rounded-full border border-accent/40 object-cover shadow-sm"
                />
                <span className="flex flex-col">
                  <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-cream hover:text-accent transition-colors duration-200 leading-none">
                    Murad Sweets
                  </span>
                  <span className="mt-1 text-[8px] uppercase tracking-[0.25em] text-accent font-subheading">
                    Artisanal Mithai
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`font-subheading text-xs tracking-widest uppercase transition-colors duration-300 relative py-1 ${isActive
                      ? 'text-accent'
                      : 'text-cream/80 hover:text-accent'
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions (Cart & Mobile Toggle) */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-cream hover:text-accent transition-colors duration-200 focus:outline-none"
                aria-label="Open cart drawer"
              >
                <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-accent text-primary-deep font-subheading text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary-deep shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-cream hover:text-accent hover:bg-primary-deep/50 focus:outline-none md:hidden transition-colors duration-200"
                aria-label="Toggle main menu"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6 stroke-[1.5]" />
                ) : (
                  <Menu className="block h-6 w-6 stroke-[1.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-primary-deep shadow-2xl z-50 p-6 flex flex-col justify-between md:hidden"
            >
              <div className="flex flex-col space-y-8">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-accent/20">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/murad-logo.jpg"
                      alt="Murad Sweets"
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full border border-accent/40 object-cover shadow-sm"
                    />
                    <span className="flex flex-col">
                      <span className="font-heading text-xl font-extrabold text-cream leading-none">
                        Murad Sweets
                      </span>
                      <span className="mt-1 text-[8px] uppercase tracking-[0.2em] text-accent font-subheading">
                        Artisanal Mithai
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-md text-cream hover:text-accent focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col space-y-5">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        href={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`font-subheading text-sm tracking-widest uppercase transition-colors duration-200 py-2 border-b border-cream/5 ${isActive ? 'text-accent' : 'text-cream/80 hover:text-accent'
                          }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-accent/20 text-center">
                <p className="text-[10px] text-cream/40 uppercase tracking-widest font-subheading">
                  USA Home Bakery
                </p>
                <p className="text-xs text-accent mt-1 font-body font-semibold">
                  Bangladeshi Heritage Sweets
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
