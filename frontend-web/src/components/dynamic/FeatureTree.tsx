// to do
// make it to where you can use arrow keys to traverse

"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import type { TreeNodeData } from "@/lib/types";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // adjust path



// All our node data, including paragraph text
const nodeDataMap = new Map<string, TreeNodeData>([
  [
    "root",
    {
      header: "Orgs",
      longHeader: "Two Kinds of Boards",
      paragraph:
        "Draob is here to help your organization through our board of directors management tools, and our online bulletin board.",
    },
  ],
  [
    "child-a",
    {
      header: "Directors",
      longHeader: "Manage Your Board of Directors",
      paragraph:
        "Understanding, managing, and fostering collaboration within an org's board of directors is essential",
    },
  ],
  [
    "grandchild-a1",
    {
      header: "Organize",
      longHeader: "Clearly Define Roles",
      paragraph:
        "Help your team by defining each member's role, permissions, and overall hierarchy.",
    },
  ],
  [
    "grandchild-a2",
    {
      header: "Chat",
      longHeader: "Collaborate and Plan",
      paragraph:
        "Discuss event ideas, answer newcomer questions, and more, all within Draob.",
    },
  ],
  [
    "child-b",
    {
      header: "Bulletin",
      longHeader: "Online Bulletin Board",
      paragraph:
        "No more printing hundreds of flyers that nobody will look at anyways, just post it here!",
    },
  ],
  [
    "grandchild-b1",
    {
      header: "Growth",
      longHeader: "Get More Eyes",
      paragraph:
        "Draob allows every org an equal chance for advertisement, leading to increased turnout and better events.",
    },
  ],
  [
    "grandchild-b2",
    {
      header: "Data",
      longHeader: "Understand, Prepare, and Adapt",
      paragraph:
        "Draob gives you analytics and insights into post performance, target audience, and suggests improvements.",
    },
  ],
]);

// Map to find a node's parent
const parentMap = new Map<string, string>([
  ["child-a", "root"],
  ["child-b", "root"],
  ["grandchild-a1", "child-a"],
  ["grandchild-a2", "child-a"],
  ["grandchild-b1", "child-b"],
  ["grandchild-b2", "child-b"],
]);

// Define the DFS traversal path
const dfsPath = [
  "root",
  "child-a",
  "grandchild-a1",
  "grandchild-a2",
  "child-b",
  "grandchild-b1",
  "grandchild-b2",
];

// --- 2. SVG Layout Definitions (Adjusted for Circles) ---

const NODE_RADIUS = 40; // Radius of each circle
const NODE_DIAMETER = NODE_RADIUS * 2; // Diameter of the circle
const NODE_SPACING_X = NODE_DIAMETER + 60; // Spacing between nodes horizontally
const NODE_SPACING_Y = NODE_DIAMETER + 60; // Spacing between nodes vertically

// Define the position and data for our 7 SVG nodes
const svgNodes = [
  // x and y here are the CENTER of the circle
  { id: "root", x: 250, y: NODE_RADIUS + 20 },
  {
    id: "child-a",
    x: 250 - NODE_SPACING_X,
    y: NODE_RADIUS + 20 + NODE_SPACING_Y,
  },
  {
    id: "child-b",
    x: 250 + NODE_SPACING_X,
    y: NODE_RADIUS + 20 + NODE_SPACING_Y,
  },
  {
    id: "grandchild-a1",
    x: 250 - NODE_SPACING_X - NODE_SPACING_X / 2,
    y: NODE_RADIUS + 20 + NODE_SPACING_Y * 2,
  },
  {
    id: "grandchild-a2",
    x: 250 - NODE_SPACING_X + NODE_SPACING_X / 2,
    y: NODE_RADIUS + 20 + NODE_SPACING_Y * 2,
  },
  {
    id: "grandchild-b1",
    x: 250 + NODE_SPACING_X - NODE_SPACING_X / 2,
    y: NODE_RADIUS + 20 + NODE_SPACING_Y * 2,
  },
  {
    id: "grandchild-b2",
    x: 250 + NODE_SPACING_X + NODE_SPACING_X / 2,
    y: NODE_RADIUS + 20 + NODE_SPACING_Y * 2,
  },
].map((node) => ({
  ...node,
  header: nodeDataMap.get(node.id)!.header,
}));

// Define the connections
const svgEdges = [
  { sourceId: "root", targetId: "child-a" },
  { sourceId: "root", targetId: "child-b" },
  { sourceId: "child-a", targetId: "grandchild-a1" },
  { sourceId: "child-a", targetId: "grandchild-a2" },
  { sourceId: "child-b", targetId: "grandchild-b1" },
  { sourceId: "child-b", targetId: "grandchild-b2" },
];

// Helper to get coordinates for lines (Adjusted for circles)
const getNodeCenter = (nodeId: string) => {
  const node = svgNodes.find((n) => n.id === nodeId);
  if (!node) return { x: 0, y: 0 };

  // For circles, the "top" and "bottom" connection points are simply offset from the center
  return {
    top: { x: node.x, y: node.y - NODE_RADIUS },
    bottom: { x: node.x, y: node.y + NODE_RADIUS },
  };
};

// Helper to get the depth of a node (0 = root)
const getNodeDepth = (nodeId: string): number => {
  let d = 0;
  let currentId: string | undefined = nodeId;
  while (currentId) {
    const parentId = parentMap.get(currentId);
    if (!parentId) break;
    d++;
    currentId = parentId;
  }
  return d;
};

// --- 3. Main Component ---

export default function FeatureTree() {
  const [selectedId, setSelectedId] = useState("root");
  const [isTraversing, setIsTraversing] = useState(true); // State to control traversal
  const isSmallScreen = useMediaQuery("(max-width: 1280px)"); // md breakpoint
  const pathIndex = useRef(0); // Ref to track traversal position

  // This MUST match the line animation duration
  const UNDRAW_DURATION = 0.3;

  // Effect to run the automatic traversal
  useEffect(() => {
    if (isTraversing) {
      const interval = setInterval(() => {
        pathIndex.current = (pathIndex.current + 1) % dfsPath.length;
        const newId = dfsPath[pathIndex.current];
        setSelectedId(newId); // This triggers all animations
      }, 2500); // Change node every 2 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount or when isTraversing changes
    }
  }, [isTraversing]); // This effect depends on the isTraversing state

  // Create a memoized Set of all active node IDs (root to selected)
  const activeNodeIds = useMemo(() => {
    const nodeIds = new Set<string>();
    let currentId: string | undefined = selectedId;

    // Walk up the tree from the selected node
    while (currentId) {
      nodeIds.add(currentId);
      currentId = parentMap.get(currentId);
    }
    return nodeIds;
  }, [selectedId]); // This recalculates whenever selectedId changes

  // Create a memoized Set of active edge IDs
  const activeEdgeIds = useMemo(() => {
    const edgeIds = new Set<string>();
    // Iterate over the active nodes (excluding root)
    for (const nodeId of activeNodeIds) {
      const parentId = parentMap.get(nodeId);
      if (parentId) {
        edgeIds.add(`${parentId}-${nodeId}`);
      }
    }
    return edgeIds;
  }, [activeNodeIds]); // This recalculates whenever activeNodeIds changes

  // Get the data for the right-side display
const nodesToDisplay = useMemo(() => {
  const selectedNodeData = nodeDataMap.get(selectedId);

  if (isSmallScreen) {
    // Mobile/tablet: only the current node
    return selectedNodeData ? [{ ...selectedNodeData, id: selectedId }] : [];
  }

  // Desktop: show full ancestor chain
  const ancestors: (TreeNodeData & { id: string })[] = [];
  let currentId: string | undefined = selectedId;

  while (currentId) {
    const data = nodeDataMap.get(currentId);
    if (data) {
      ancestors.push({ ...data, id: currentId });
    }
    currentId = parentMap.get(currentId);
  }

  return ancestors.reverse();
}, [selectedId, isSmallScreen]);


  // Helper function to stop traversal and set selected node
  const handleNodeClick = (nodeId: string) => {
    if (isTraversing) {
      setIsTraversing(false); // Stop traversal forever
    }
    setSelectedId(nodeId); // This triggers all animations
  };

  // Calculate line lengths once
  const edgeLengths = useMemo(() => {
    const lengths = new Map<string, number>();
    for (const edge of svgEdges) {
      const sourcePos = getNodeCenter(edge.sourceId).bottom;
      const targetPos = getNodeCenter(edge.targetId).top;
      const dx = targetPos!.x - sourcePos!.x;
      const dy = targetPos!.y - sourcePos!.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      lengths.set(`${edge.sourceId}-${edge.targetId}`, length);
    }
    return lengths;
  }, []); // Empty dependency array, runs once

  // Calculate edge depths once
  const [edgeDepthMap, MAX_DEPTH] = useMemo(() => {
    const depths = new Map<string, number>();
    let max = 0;

    // We need to use the standalone getNodeDepth function here
    for (const edge of svgEdges) {
      // Depth of an edge is the depth of its target node
      const depth = getNodeDepth(edge.targetId);
      depths.set(`${edge.sourceId}-${edge.targetId}`, depth);
      if (depth > max) max = depth;
    }
    return [depths, max];
  }, []); // Empty dependency, runs once

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 xl:gap-32 p-8 bg-white mt-4">
      {/* Left Side: SVG Tree */}
      <div className="md:w-1/2 w-full flex items-start justify-center h-">
        <svg
          viewBox="0 0 500 390" // Adjusted viewBox height for more vertical space
          className="w-full max-w-lg"
          style={{ userSelect: "none" }}
        >
          {/* 1. Draw all the static gray dashed lines */}
          <g className="lines-bg">
            {svgEdges.map((edge) => {
              const sourcePos = getNodeCenter(edge.sourceId).bottom;
              const targetPos = getNodeCenter(edge.targetId).top;
              return (
                <line
                  key={`${edge.sourceId}-${edge.targetId}-bg`}
                  x1={sourcePos!.x}
                  y1={sourcePos!.y}
                  x2={targetPos!.x}
                  y2={targetPos!.y}
                  stroke={"#9ca3af"} // gray-400
                  strokeWidth={2}
                  strokeDasharray={"9 9"}
                />
              );
            })}
          </g>

          {/* 2. Draw all the animating blue lines over top */}
          <g className="lines-fg">
            {svgEdges.map((edge) => {
              const edgeId = `${edge.sourceId}-${edge.targetId}`;
              const isActive = activeEdgeIds.has(edgeId);
              const lineLength = edgeLengths.get(edgeId) || 0;
              const depth = edgeDepthMap.get(edgeId) || 0;

              const FADE_DURATION = 0.2;

              // Delay for appearing (top-down)
              const appearDelay = (depth - 1) * 0.2; // root-children (depth 1) = 0, grandchildren (depth 2) = 0.2

              // Delay for disappearing (bottom-up)
              const disappearDelay = (MAX_DEPTH - depth) * 0.3; // grandchild (depth 2) = 0, child (depth 1) = 0.3

              const sourcePos = getNodeCenter(edge.sourceId).bottom;
              const targetPos = getNodeCenter(edge.targetId).top;

              return (
                <motion.line
                  key={edgeId}
                  x1={sourcePos!.x}
                  y1={sourcePos!.y}
                  x2={targetPos!.x}
                  y2={targetPos!.y}
                  stroke={"#b45309"}
                  strokeWidth={2}
                  strokeDasharray={lineLength}
                  // Start as "undrawn" and invisible
                  initial={{ strokeDashoffset: lineLength, opacity: 0 }}
                  // Animate to "drawn" and visible, or back
                  animate={{
                    strokeDashoffset: isActive ? 0 : lineLength,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    strokeDashoffset: {
                      duration: UNDRAW_DURATION,
                      ease: "easeOut",
                      delay: isActive ? appearDelay : disappearDelay,
                    },
                    opacity: {
                      duration: FADE_DURATION,
                      // Fade out after undraw starts
                      delay: isActive
                        ? appearDelay
                        : disappearDelay + UNDRAW_DURATION * 0.5,
                    },
                  }}
                />
              );
            })}
          </g>

          {/* 3. Draw all the nodes (circles and text) */}
          <g className="nodes">
            {svgNodes.map((node) => {
              const isActive = activeNodeIds.has(node.id); // Check if node is in the active path
              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)} // Use new handler
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x} // Center X
                    cy={node.y} // Center Y
                    r={NODE_RADIUS} // Radius
                    fill={isActive ? "#fef3c7" : "#ffffff"} // blue-100 or white
                    stroke={isActive ? "#b45309" : "#9ca3af"} // blue-600 or gray-200
                    strokeWidth={2}
                  />
                  <text
                    x={node.x} // Center X
                    y={node.y} // Center Y
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isActive ? "#78350f" : "#374151"} // blue-800 or gray-700
                    className="text-sm font-semibold"
                  >
                    {node.header}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Right Side: Display */}
      <div className="md:w-1/2 w-full relative overflow-hidden">
        <AnimatePresence>
          {nodesToDisplay.map((data, index) => {
            // Calculate delay for this specific text block
            const depth = getNodeDepth(data.id);
            const appearDelay = depth === 0 ? 0 : (depth - 1) * 0.2;
            const totalDelay = depth === 0 ? 0 : appearDelay + UNDRAW_DURATION;

            return (
              <motion.div
                key={data.id} // Use stable ID for AnimatePresence
                className={`
                  ${index > 0 ? "mt-6 border-t border-gray-200 pt-6" : ""}
                `}
                initial={{ opacity: 0, x: -30 }} // Start invisible and to the left
                animate={{ opacity: 1, x: 0 }} // Animate to visible and in place
                exit={{ opacity: 0, position: "absolute" }} // Fade out and prevent layout jump
                transition={{
                  duration: 0.2, // Duration of the slide
                  delay: totalDelay, // Wait for the line animation to finish
                  ease: "easeInOut",
                }}
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  {data.longHeader}
                </h2>
                <p className="mt-2 text-md text-gray-600">{data.paragraph}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}