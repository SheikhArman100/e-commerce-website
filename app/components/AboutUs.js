"use client";

import AboutUsImage from "@/public/assets/aboutUsImage.jpg";
import { Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="relative w-full min-h-screen bg-bgColor text-textColor py-24 lg:py-32 px-6 sm:px-12 lg:px-24 overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(155,34,66,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(244,194,194,0.05),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 flex flex-col items-start gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accentColor/10 border border-accentColor/20 mb-6">
                <Star className="w-3 h-3 text-accentColor fill-accentColor" />
                <span className="text-accentColor text-[0.65rem] uppercase tracking-[0.3em] font-bold">The Artisanal Journey</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                Crafting Joy, <br />
                <span className="text-accentColor italic serif">One Layer</span> at a Time.
              </h2>

              <p className="text-lg md:text-xl text-stone-500 font-light leading-relaxed max-w-xl mb-10">
                At <span className="text-textColor font-medium">Baking Tales</span>, we believe life's finest moments are handcrafted.
                We meticulously source the world's most exquisite ingredients to compose scrumptious cakes and delicate cupcakes that tell a story of passion and pure indulgence.
              </p>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <p className="text-2xl font-bold text-textColor mb-1">Est. 2023</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Artisanal Roots</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accentColor mb-1">98%</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Client Happiness</p>
                </div>
              </div>

              <Link href="/about" className="group flex items-center gap-4 text-textColor uppercase tracking-[0.3em] text-[0.7rem] font-black">
                <span>Discover Our Story</span>
                <div className="w-10 h-10 rounded-full border border-textColor/10 flex items-center justify-center group-hover:border-accentColor/40 group-hover:bg-accentColor/5">
                  <ArrowRight className="w-4 h-4 group-hover:text-accentColor" />
                </div>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative aspect-[4/5] w-full max-w-[500px] mx-auto lg:max-w-none">
            <div className="absolute inset-4 bg-accentColor2/20 backdrop-blur-2xl border border-textColor/10 rounded-[2.5rem] -rotate-3 z-0" />

            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl z-10 border border-textColor/5">
              <Image
                src={AboutUsImage}
                alt="Baking Tales Kitchen"
                className="object-cover w-full h-full"
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bgColor/20 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 p-6 bg-bgColor/80 backdrop-blur-xl border border-textColor/5 rounded-2xl shadow-xl">
                <p className="text-sm font-light italic leading-relaxed text-textColor/90">
                  "We don't just bake; we create edible memories designed to linger long after the last crumb is gone."
                </p>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 border border-accentColor/20 rounded-full blur-sm" />
            <div className="absolute -bottom-10 -left-10 w-40 h-1 bg-gradient-to-r from-accentColor/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
