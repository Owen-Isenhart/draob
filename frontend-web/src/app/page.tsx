"use client"
import Image from "next/image";
import NavBar from "@/components/static/NavBar";
import Footer from "@/components/static/Footer";
import HomeFlyer from "@/components/dynamic/HomeFlyer";
import AnimatedBoard from "@/components/dynamic/AnimatedBoard";
import FeatureTree from "@/components/dynamic/FeatureTree";
import { useMediaQuery } from "@/hooks/useMediaQuery";
export default function Home() {

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return (
    // This grid container is now the root, creating the three-column layout
    <div className="grid grid-cols-1 md:grid-cols-12">
      {/* Left Vertical Border Gutter */}
      <div className="hidden md:block md:col-span-1 border-r border-dashed">
        {/* This empty div ensures the border spans the full height */}
        <div className="h-full diagonal-lines"></div>
      </div>

      {/* Main Content Area (10 columns on desktop) */}
      <div className="col-span-1 md:col-span-10 flex flex-col min-h-screen">
        <NavBar />

        {/* Main content is now just a flex-grow part of this column */}
        <main className="flex flex-col flex-grow">
          {/* Section 1: Hero (HomeFlyer + AnimatedBoard) 
              Note: I've removed the 'border-dashed' from the sections 
              to match your reference code, leaving only the vertical borders.
          */}
          <section className="py-16 px-4">
            <div
              className="
                flex flex-col md:flex-row w-full gap-8 md:gap-16 lg:gap-24 xl:gap-32 
                items-center justify-center px-4
              "
            >
              <HomeFlyer />
              {isDesktop && <AnimatedBoard />}
              
            </div>
          </section>

          {/* Section 2: Features (FeatureTree) */}
          <section className="px-4">
            <div
              className="flex flex-col md:flex-row w-full px-4 
                items-center justify-center"
            >
              <FeatureTree />
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Right Vertical Border Gutter */}
      <div className="hidden md:block md:col-span-1 border-l border-dashed">
        {/* This empty div ensures the border spans the full height */}
        <div className="h-full diagonal-lines"></div>
      </div>
    </div>
  );
}