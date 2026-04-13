"use client";

import { motion } from "framer-motion";
import JournalCardModern from "@/Components/JournalCardModern";
import AboutUsImage from "@/public/assets/aboutUsImage.jpg";
import { ArrowRight, Star, Quote, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Journals = () => {
  const journalsData = [
    {
      image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "The Alchemy of Flour & Butter",
      date: "March 12, 2024"
    },
    {
      image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Whispers of Madagascar Vanilla",
      date: "March 08, 2024"
    },
    {
      image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Composing the Perfect Crumb",
      date: "Feb 28, 2024"
    },
    {
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Velvet Ganache Chronicles",
      date: "Feb 15, 2024"
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-bgColor text-textColor selection:bg-accentColor selection:text-bgColor overflow-x-hidden pt-32 pb-24">
      {/* Modern Background Accents */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(155,34,66,0.05),transparent_60%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(93,64,55,0.02),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Modern Minimalist Hero */}
        <section className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-textColor/5 border border-textColor/10 mb-10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-accentColor" />
              <span className="text-accentColor text-[0.7rem] uppercase tracking-[0.4em] font-black">Culinary Chronicles</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 text-textColor">
              Jotted In <br />
              Our <span className="text-accentColor font-light italic serif text-8xl md:text-[10rem] lg:text-[12rem]">Journal.</span>
            </h1>
            
            <p className="text-stone-500 text-lg md:text-xl font-light italic leading-relaxed max-w-2xl mx-auto border-t border-textColor/10 pt-10">
              Exploring the narratives behind our artisanal creations, from sourdough secrets to the soul of dark chocolate.
            </p>
          </motion.div>
        </section>

        {/* Feature Narrative Card - Glassmorphic */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="group relative w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-textColor/10 bg-white/50 backdrop-blur-sm"
          >
            <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000">
               <Image 
                 src="https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                 alt="Featured Story" 
                 fill
                 className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-bgColor via-bgColor/10 to-transparent" />
            </div>

            <div className="absolute inset-x-12 bottom-12 flex flex-col items-start max-w-2xl">
              <div className="flex items-center gap-4 text-accentColor text-[0.6rem] uppercase tracking-widest font-black mb-6">
                 <span>Featured Story</span>
                 <div className="w-10 h-px bg-accentColor/40" />
                 <span>March 20, 2024</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-textColor">Beyond the Crust: The Science of Artisanal Sourdough.</h2>
              <button className="flex items-center gap-4 text-textColor uppercase tracking-[0.3em] text-[0.7rem] font-black group/btn">
                 <span>Read Full Story</span>
                 <div className="w-10 h-10 rounded-full border border-textColor/10 flex items-center justify-center group-hover/btn:border-accentColor group-hover/btn:bg-accentColor/10 transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover/btn:text-accentColor transition-colors" />
                 </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Main Journal Grid */}
        <section>
          <div className="flex justify-between items-end mb-16 px-4">
             <div>
                <h3 className="text-2xl font-bold text-textColor mb-2">Latest Insights</h3>
                <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">Recent entries from the studio</p>
             </div>
             <div className="hidden lg:flex items-center gap-2 p-2 bg-textColor/5 rounded-full border border-textColor/10">
                <div className="w-10 h-10 rounded-full bg-accentColor flex items-center justify-center">
                   <Quote className="w-4 h-4 text-bgColor" />
                </div>
                <span className="text-[0.65rem] font-bold uppercase tracking-widest px-4 pr-6">Studio Notes</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journalsData.map((journal, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group flex flex-col"
              >
                <JournalCardModern
                  image={journal.image}
                  title={journal.title}
                  date={journal.date}
                />
                <div className="mt-6 flex justify-between items-center px-2">
                   <p className="text-[0.65rem] uppercase tracking-widest text-stone-500 font-bold">{journal.date}</p>
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-accentColor" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Perspective Statement */}
        <section className="mt-40 pt-24 border-t border-textColor/10 text-center relative overflow-hidden">
           <Quote className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 text-textColor/[0.05] pointer-events-none" />
           <p className="text-3xl md:text-4xl font-light italic text-stone-500 max-w-4xl mx-auto leading-relaxed mb-16 relative z-10">
             "Baking is a language of love, whispered through the <span className="text-textColor font-medium">crunch of a crust</span> and the <span className="text-accentColor italic serif text-4xl">slow melt</span> of a perfect ganache."
           </p>
           <Link href="/">
              <button className="px-10 py-4 bg-textColor/5 hover:bg-textColor/10 border border-textColor/10 rounded-full text-[0.7rem] font-black uppercase tracking-[0.4em] transition-all duration-500 hover:tracking-[0.6em] text-textColor">
                 Back to Studio
              </button>
           </Link>
        </section>

      </div>
    </div>
  );
};

export default Journals;
