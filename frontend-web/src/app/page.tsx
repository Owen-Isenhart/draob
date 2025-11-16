import Image from "next/image";
import NavBar from "@/components/static/NavBar";
import Footer from "@/components/static/Footer"
import HomeFlyer from "@/components/dynamic/HomeFlyer";
import AnimatedBoard from "@/components/dynamic/AnimatedBoard";
import FeatureTree from "@/components/dynamic/FeatureTree";
export default function Home() {
  return (
    
    <div className="">
      <NavBar />
      <main className="flex flex-col gap-8">
        <div className="
          flex flex-col md:flex-row w-full gap-8 mt-15 
          items-center justify-center px-4
        ">
          <HomeFlyer />
          <AnimatedBoard />
        </div>
        <div className="">
          <FeatureTree />

        </div>
      </main>
      <Footer />
    </div>
  );
}