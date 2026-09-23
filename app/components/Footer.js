import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-bgColor text-textColor pt-12 pb-8 px-6 md:px-12 lg:px-24 border-t border-textColor/10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.5fr] gap-12 lg:gap-24">
        
        {/* Brand Narrative */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <div className="flex items-center gap-x-2">
            <span className="text-2xl font-bold tracking-tighter text-accentColor font2">Baking Tales</span>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed font-light max-w-sm">
            Crafting edible memories since our first oven spark. We believe in the magic of handcrafted treats, meticulously sourced ingredients, and the joy of sharing a perfect bite with those you love.
          </p>
          <div className="flex items-center gap-x-4">
            <Link href="#" className="p-2 rounded-full bg-textColor/5 hover:bg-accentColor/10 transition-colors duration-300">
              <Instagram className="w-4 h-4 text-accentColor" />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-textColor/5 hover:bg-accentColor/10 transition-colors duration-300">
              <Facebook className="w-4 h-4 text-accentColor" />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-textColor/5 hover:bg-accentColor/10 transition-colors duration-300">
              <Twitter className="w-4 h-4 text-accentColor" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <h4 className="text-lg font-semibold font2 text-accentColor tracking-wide">Explore</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="text-stone-500 hover:text-accentColor text-sm transition-colors duration-300">Home</Link>
            </li>
            <li>
              <Link href="/products" className="text-stone-500 hover:text-accentColor text-sm transition-colors duration-300">The Shop</Link>
            </li>
            <li>
              <Link href="/about" className="text-stone-500 hover:text-accentColor text-sm transition-colors duration-300">Our Story</Link>
            </li>
            {/* <li>
              <Link href="/journals" className="text-stone-500 hover:text-accentColor text-sm transition-colors duration-300">Journal</Link>
            </li> */}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <h4 className="text-lg font-semibold font2 text-accentColor tracking-wide">Get in Touch</h4>
          <ul className="space-y-4">
            <li className="flex flex-col md:flex-row items-center md:items-start gap-x-3 text-stone-500 text-sm">
              <MapPin className="w-4 h-4 md:mt-0.5 text-accentColor mb-2 md:mb-0" />
              <span>21, Syed hasan ali lane, Islampur, Dhaka</span>
            </li>
            <li className="flex flex-col md:flex-row items-center md:items-center gap-x-3 text-stone-500 text-sm">
              <Phone className="w-4 h-4 text-accentColor mb-2 md:mb-0" />
              <span>(+880) 1892555458</span>
            </li>
            <li className="flex flex-col md:flex-row items-center md:items-center gap-x-3 text-stone-500 text-sm">
              <Mail className="w-4 h-4 text-accentColor mb-2 md:mb-0" />
              <span>sheikharman100@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-textColor/10 flex flex-col md:flex-row justify-between items-center gap-y-4">
        <p className="text-stone-500 text-xs font-light">
          &copy; {new Date().getFullYear()} Baking Tales. Handcrafted with love.
        </p>
        <div className="flex items-center gap-x-6 text-stone-500 text-xs font-light">
          <Link href="#" className="hover:text-accentColor transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-accentColor transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
