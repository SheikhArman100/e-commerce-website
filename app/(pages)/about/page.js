"use client";

import { motion } from "framer-motion";
import AboutUsImage from "@/public/assets/aboutUsImage.jpg";
import { Star, ShieldCheck, Heart, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

const About = () => {
  return (
    <div className="relative w-full bg-bgColor text-textColor selection:bg-accentColor selection:text-bgColor overflow-x-hidden  pt-24 md:pt-36 lg:pt-40 pb-24">
    

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Modern Hero Section */}
        <section className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-textColor/5 border border-textColor/10 mb-10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-accentColor" />
              <span className="text-accentColor text-[0.7rem] uppercase tracking-[0.4em] font-black">Our Heritage</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8">
              A Culture of <br />
              <span className="text-accentColor font-light italic serif italic">Excellence.</span>
            </h1>
            
            <p className="text-stone-500 text-sm tracking-[0.5em] uppercase font-bold max-w-lg mx-auto border-t border-textColor/5 pt-8">
              EST. 2023 — CURATING BOLD FLAVORS
            </p>
          </motion.div>
        </section>

        {/* Modular Narrative: Chapter 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight">Handcrafted with <br />Passion & Precision.</h2>
            <p className="text-xl text-stone-600 font-light leading-relaxed mb-12">
              Here at <span className="text-textColor font-medium">Baking Tales</span>, we believe that everyone deserves to experience the sublime. 
              Our studio is a sanctuary where passion meets precision, creating decadent cakes, delicate cupcakes, and artisanal chocolates that aren't just treats—they're edible stories handcrafted from the world's most exquisite ingredients.
            </p>
            
            <div className="flex items-center gap-8 p-8 bg-textColor/[0.02] border border-textColor/5 rounded-3xl backdrop-blur-sm">
               <div className="w-16 h-16 rounded-2xl bg-accentColor/10 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-accentColor" />
               </div>
               <div>
                  <p className="text-2xl font-bold text-textColor">98%</p>
                  <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">Client Bliss Rate</p>
               </div>
            </div>
          </motion.div>

          {/* Clean Image Composition with Glass Layer */}
          <div className="relative aspect-square w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute inset-0 bg-accentColor/5 rounded-[4rem] blur-[80px] pointer-events-none" 
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-textColor/5"
            >
              <Image
                src={AboutUsImage}
                alt="Studio Atmosphere"
                className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-1000"
                placeholder="blur"
              />
              <div className="absolute inset-x-8 bottom-8 p-8 bg-bgColor/60 backdrop-blur-2xl border border-textColor/10 rounded-2xl">
                 <p className="text-sm font-light italic leading-relaxed text-textColor/80 text-center">
                   "We don't just bake; we compose memories, one exquisite layer at a time."
                 </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Modern Philosophy Grid */}
        <section className="mb-40">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Core Values</h2>
            <div className="w-20 h-1 bg-accentColor/30 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Pure Ingredients", 
                desc: "Sourcing only the finest organic cocoa, Madagascan vanilla, and locally churned butter from family farms." 
              },
              { 
                icon: Heart, 
                title: "Artisan Soul", 
                desc: "Every decoration is hand-piped, every flavor profile composed like a symphony by our master pâtissiers." 
              },
              { 
                icon: Sparkles, 
                title: "Indulgent Legacy", 
                desc: "Carrying forward the traditions of classical pastry with a modern, darker aesthetic for the contemporary palate." 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="group p-10 bg-textColor/[0.02] border border-textColor/5 rounded-3xl hover:bg-textColor/[0.04] transition-all duration-500 hover:border-accentColor/20"
              >
                <div className="w-14 h-14 rounded-2xl bg-textColor/5 flex items-center justify-center mb-8 group-hover:bg-accentColor/10 group-hover:scale-110 transition-all duration-500">
                  <item.icon className="w-6 h-6 text-stone-500 group-hover:text-accentColor transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-stone-500 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Statement Section */}
        <section className="relative py-32 rounded-[4rem] bg-gradient-to-b from-textColor/5 to-transparent border-x border-t border-textColor/10 overflow-hidden text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-5xl md:text-7xl lg:text-8xl text-accentColor font2 tracking-tight mb-12">
              Welcome To Our Bakery.
            </h3>
            
            <div className="flex flex-col items-center gap-10">
              {/* <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-bgColor bg-accentColor2 flex items-center justify-center overflow-hidden hover:z-20 hover:scale-110 transition-transform shadow-md">
                     <Image src={AboutUsImage} alt="Founder" className="w-full h-full object-cover grayscale opacity-80" />
                  </div>
                ))}
              </div> */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-textColor/90 uppercase tracking-[0.4em]">Handcrafted Excellence</p>
                <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">Baking Tales Boutique — Passion in every crumb</p>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default About;
