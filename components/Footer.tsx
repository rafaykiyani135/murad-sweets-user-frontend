import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, MessageCircle, DollarSign } from 'lucide-react';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-deep text-cream border-t border-accent/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/murad-logo.jpg"
                alt="Murad Sweets"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border border-accent/40 object-cover shadow-sm"
              />
              <span className="flex flex-col">
                <span className="font-heading text-2xl font-extrabold tracking-tight text-accent leading-none">
                  Murad Sweets
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-cream font-subheading">
                  Artisanal Mithai
                </span>
              </span>
            </Link>
            <p className="text-xs text-cream/75 leading-relaxed font-body">
              Crafting authentic Bangladeshi sweets and traditional winter pitha in the USA. Made with pure ghee, fresh chenna, and organic jaggery, carrying traditions across oceans.
            </p>
            {/* Socials */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://cash.app/order/$muradsweets/pickup"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-primary-deep transition-all duration-200"
                aria-label="Order on CashApp"
              >
                <DollarSign className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/p/Murad-Sweets-61581084905385/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-primary-deep transition-all duration-200"
                aria-label="Visit Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/murad_sweets_usa/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-primary-deep transition-all duration-200"
                aria-label="Visit Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-subheading text-sm text-accent uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs text-cream/80 font-body">
              <li>
                <Link href="/" className="hover:text-accent hover:underline transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-accent hover:underline transition-all">
                  Browse Sweets
                </Link>
              </li>
              {/* <li>
                <Link href="/#about" className="hover:text-accent hover:underline transition-all">
                  Our Story
                </Link>
              </li> */}
              <li>
                <Link href="/contact" className="hover:text-accent hover:underline transition-all">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-subheading text-sm text-accent uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-3.5 text-xs text-cream/80 font-body">
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="hover:text-accent transition-colors">(346) 368-4831</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>
                  Houston, Texas 77055 <br />
                  <span className="text-[10px] text-cream/50">(Exact pickup address on order confirmation)</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Hours & Fulfillment */}
          {/* <div>
            <h3 className="font-subheading text-sm text-accent uppercase tracking-wider mb-4">Fulfillment Hours</h3>
            <ul className="space-y-3.5 text-xs text-cream/80 font-body">
              <li className="flex items-start space-x-2.5">
                <Clock className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold">Pickups:</span>
                  <span>Friday – Sunday: 10:00 AM – 8:00 PM</span>
                  <span className="block font-bold mt-2">Deliveries:</span>
                  <span>Saturdays & Sundays only</span>
                </div>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Ornament divider and Copyright */}
        <div className="border-t border-accent/20 pt-8 mt-8 text-center flex flex-col items-center">

          <p className="text-[10px] text-cream/50 uppercase tracking-widest font-subheading">
            &copy; {currentYear} Murad Sweets. All rights reserved.
          </p>
          <p className="text-[10px] text-cream/40 uppercase tracking-widest font-subheading mt-1.5">
            made with ❤️ by <a href="https://acumoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent underline transition-colors normal-case">Acumo AI</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
