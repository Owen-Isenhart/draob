// to do
// 

import Flyer from "./Flyer"; // Make sure this path is correct

export default function AnimatedBoard() {
  const graphPaperStyle = {
    backgroundImage: `
      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
    `,
    backgroundSize: "2rem 2rem",
    backgroundColor: "#f9fafb",
  };

  return (
    <div
      // 1. Replaced `h-100` with `h-96`
      // 2. You also need `w-full` to make it fill the `max-w-lg`
      className="relative w-full max-w-lg border h-96 sm:h-114 overflow-hidden" 
      style={graphPaperStyle}
    >
      {/* Flyer 1 */}
      <Flyer
        className="top-8 left-15 -rotate-[6deg] bg-lime-200"
        initial={{ opacity: 0, y: -100, x: -50 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <h3 className="font-bold">SUAAB Homefest</h3>
        <p className="text-sm">Nov 1 - Lot J</p>
      </Flyer>

      {/* Flyer 2 */}
      <Flyer
        className="top-40 left-32 rotate-[4deg] bg-blue-200"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <h3 className="font-bold">ACM Kickoff</h3>
        <p className="text-sm">Sep 2 - ECSW</p>
      </Flyer>

      {/* Flyer 3 */}
      <Flyer
        className="top-20 right-8 rotate-[8deg] bg-yellow-200"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
      >
        <h3 className="font-bold">GDSC Workshop</h3>
        <p className="text-sm">Oct 12 - ECSS</p>
      </Flyer>

      <Flyer
        className="top-60 right-4 -rotate-[5deg] bg-red-200"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
      >
        <h3 className="font-bold">DFR Halloween Party</h3>
        <p className="text-sm">Oct 30 - Shop Courtyard</p>
      </Flyer>

      <Flyer
        className="top-70 left-8 rotate-[2deg] bg-orange-200"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 100 }}
      >
        <h3 className="font-bold">UTDPL Practice</h3>
        <p className="text-sm">Dec 7 - POD</p>
      </Flyer>
    </div>
  );
}