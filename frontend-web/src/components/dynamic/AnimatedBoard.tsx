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
      className="relative w-full max-w-lg border h-96 overflow-hidden mr-auto" 
      style={graphPaperStyle}
    >
      {/* Flyer 1 */}
      <Flyer
        className="top-8 left-6 -rotate-[6deg]"
        initial={{ opacity: 0, y: -100, x: -50 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <h3 className="font-bold">Events</h3>
        <p className="text-sm">Check out the latest...</p>
      </Flyer>

      {/* Flyer 2 */}
      <Flyer
        className="top-40 left-32 rotate-[4deg]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <h3 className="font-bold">Student Orgs</h3>
        <p className="text-sm">Join a new club!</p>
      </Flyer>

      {/* Flyer 3 */}
      <Flyer
        className="top-20 right-8 rotate-[8deg] bg-yellow-100"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
      >
        <h3 className="font-bold">For Sale</h3>
        <p className="text-sm">Used textbooks...</p>
      </Flyer>
    </div>
  );
}