"use client";
import Button from "@/Components/Button";
import FramerMagnetic from "@/Components/FramerMagnetic";
import SectionTitle from "@/Components/SectionTitle";
import image1 from "@/public/assets/homeImage1.jpg";
import image2 from "@/public/assets/pexels-jonathan-borba-9816191.jpg";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Star,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import image3 from "../../public/assets/frank-zhang-53nLF9woXE0-unsplash.jpg";

const HomeContainer = ({ children }) => {
  return (
    <section className="w-full h-full max-w-[1600px] mx-auto overflow-hidden">
      {/* Premium Hero Section */}
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-bgColor pt-24 md:pt-36 lg:pt-40">
        
        {/* Left Content Side */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-10 md:px-16 pb-20 z-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center lg:justify-start gap-x-2 mb-6"
          >
            <Star fill="#9B2242" stroke="none" className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-accentColor tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase">
              Premium Bakery
            </span>
            <Star fill="#9B2242" stroke="none" className="h-4 w-4 md:h-5 md:w-5" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-textColor text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] mb-8 tracking-tight"
          >
            Baking for <br />
            <span className="text-accentColor">Your Pleasure</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-textColor/80 text-base md:text-lg lg:text-xl max-w-lg mb-10 leading-relaxed font-light mx-auto lg:mx-0"
          >
            Enjoy your indulgent afternoon tea in the comfort of your home with the most beautiful & scrumptious cakes, crafted from the finest ingredients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex justify-center lg:justify-start w-full"
          >
            <Button className="w-48 h-12 md:w-56 md:h-14 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-lg" href="/products">

              <Button.Border1 />
              <Button.Border2 />
              <Button.Title className="text-xs md:text-base uppercase tracking-widest font-bold text-bgColor">Discover Shop</Button.Title>
              <Button.Icon>
                <ArrowRight className="stroke-bgColor" />
              </Button.Icon>
            </Button>
          </motion.div>

          {/* Social Links Placement */}
          <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8">
            <div className="flex items-center gap-x-4">
              <div className="w-8 md:w-12 h-[1px] bg-accentColor/30" />
              <span className="text-textColor/50 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] whitespace-nowrap">
                Follow Our Story
              </span>
            </div>
            <div className="flex gap-x-3">
              {[
                { Icon: Facebook, link: "#" },
                { Icon: Instagram, link: "#" },
                { Icon: Twitter, link: "#" },
              ].map((social, idx) => (
                <FramerMagnetic key={idx}>
                  <a
                    href={social.link}
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-textColor/10 bg-textColor/5 rounded-full hover:border-accentColor hover:bg-accentColor transition-all duration-500 text-textColor/70 hover:text-bgColor group shadow-sm"
                  >
                    <social.Icon
                      size={16}
                      className="md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform duration-500"
                      strokeWidth={1.5}
                    />
                  </a>
                </FramerMagnetic>
              ))}
            </div>
          </div>
        </div>

        {/* Right Visual Side */}
        <div className="w-full lg:w-1/2 relative min-h-[500px] md:min-h-[550px] lg:min-h-0 flex-1 px-4 sm:px-8 lg:pl-12 lg:pr-24 pb-16 lg:pb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative h-full w-full min-h-[500px] md:min-h-[550px]"
          >
             <Image
              src={image1}
              alt="Artisanal Bakery Campaign"
              fill
              className="object-cover rounded-3xl lg:rounded-[3.5rem] shadow-2xl"
              priority
              placeholder="blur"
            />
            {/* Elegant Gradient Overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-bgColor/80 via-transparent to-transparent lg:block hidden rounded-[3.5rem]" />
            <div className="absolute inset-0 bg-gradient-to-t from-bgColor via-transparent to-transparent lg:hidden block rounded-3xl" /> */}
            
            {/* Premium 'New Arrivals' Feature Box */}
              <motion.div 
                initial={{ opacity: 0, x: 100, rotate: 2 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 right-auto md:left-auto md:translate-x-0 md:bottom-12 md:right-12 lg:-left-24 lg:bottom-12 z-30 bg-accentColor2/80 backdrop-blur-3xl p-4 md:p-8 border border-white/20 rounded-3xl w-[90%] max-w-[240px] md:max-w-sm shadow-xl group overflow-hidden flex flex-col items-center md:items-start text-center md:text-left"
              >
              {/* Subtle light streak animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="flex flex-col md:flex-row items-center justify-between w-full mb-2 gap-1 md:gap-2">
                <div className="flex items-center gap-x-2">
                  <Star fill="#9B2242" stroke="none" className="h-3 w-3 md:hidden" />
                  <SectionTitle title="New Arrival" className="!mb-0 scale-75 md:scale-100 origin-center md:origin-left !text-textColor" />
                  <Star fill="#9B2242" stroke="none" className="h-3 w-3 md:hidden" />
                </div>
              </div>

              <h4 className="text-textColor text-xs md:text-xl font-bold leading-tight mb-3 md:mb-6 tracking-tight">
                Our Fall Product Collection is here
              </h4>

              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-6">
                <div className="flex -space-x-3 justify-center">
                  {[image2, image3].map((img, i) => (
                    <div key={i} className="w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-xl border-2 border-bgColor overflow-hidden relative rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-xl">
                      <Image src={img} alt="item" fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" placeholder="blur" />
                    </div>
                  ))}
                  <div className="w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-xl border-2 border-bgColor bg-accentColor flex items-center justify-center text-bgColor font-black text-[10px] md:text-sm shadow-xl -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    +5
                  </div>
                  <FramerMagnetic>
                  <a href="/products" className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center bg-textColor/10 rounded-full hover:bg-accentColor hover:text-bgColor transition-all duration-300 group/link shadow-sm border border-textColor/5 ml-4">
                    <ArrowRight size={16} className="md:w-[22px] md:h-[22px] group-hover/link:translate-x-1 transition-transform text-textColor" />
                  </a>
                </FramerMagnetic>
                </div>
                
                
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content (Children) */}
      <div className="relative z-40 bg-bgColor mt-0">
        {children}
      </div>
    </section>
  );
};

export default HomeContainer;
