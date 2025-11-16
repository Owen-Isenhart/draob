export default function Footer() {
  return (
    <>
      <footer className="relative w-full h-[clamp(5rem,20vw,25rem)] z-10 flex justify-center text-[var(--foreground)] border-t border-dashed overflow-clip">
        <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 
          font-black tracking-normal opacity-70 whitespace-nowrap
          [text-rendering:geometricPrecision]
          text-[clamp(5rem,20vw,25rem)]
          bottom-[calc(-1*clamp(5rem,20vw,25rem)/2)]">
          draob<span className="text-amber-700">.</span>
        </p>
        <div className="grid-effect"></div>
        <div className="gradient"></div>
      </footer>

      
    </>
  );
}