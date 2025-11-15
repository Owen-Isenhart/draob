// to do
// make it automatically go through the paths of the tree
// make it to where you can use arrow keys to traverse
// make animations better

"use client";

import { useState, useCallback, useMemo } from "react";

// --- 1. Define Data & Types ---

type TreeNodeData = {
  header: string;
  longHeader: string,
  paragraph: string;
};

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

// --- 2. SVG Layout Definitions (Adjusted for Circles) ---

const NODE_RADIUS = 40; // Radius of each circle
const NODE_DIAMETER = NODE_RADIUS * 2; // Diameter of the circle
const NODE_SPACING_X = NODE_DIAMETER + 60; // Spacing between nodes horizontally
const NODE_SPACING_Y = NODE_DIAMETER + 60; // Spacing between nodes vertically

// Define the position and data for our 7 SVG nodes
const svgNodes = [
  // x and y here are the CENTER of the circle
  { id: "root", x: 250, y: NODE_RADIUS + 20 },
  { id: "child-a", x: 250 - NODE_SPACING_X, y: NODE_RADIUS + 20 + NODE_SPACING_Y },
  { id: "child-b", x: 250 + NODE_SPACING_X, y: NODE_RADIUS + 20 + NODE_SPACING_Y },
  { id: "grandchild-a1", x: (250 - NODE_SPACING_X) - NODE_SPACING_X / 2, y: NODE_RADIUS + 20 + NODE_SPACING_Y * 2 },
  { id: "grandchild-a2", x: (250 - NODE_SPACING_X) + NODE_SPACING_X / 2, y: NODE_RADIUS + 20 + NODE_SPACING_Y * 2 },
  { id: "grandchild-b1", x: (250 + NODE_SPACING_X) - NODE_SPACING_X / 2, y: NODE_RADIUS + 20 + NODE_SPACING_Y * 2 },
  { id: "grandchild-b2", x: (250 + NODE_SPACING_X) + NODE_SPACING_X / 2, y: NODE_RADIUS + 20 + NODE_SPACING_Y * 2 },
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

// --- 3. Main Component ---

export default function FeatureTree() {
  const [selectedId, setSelectedId] = useState("root");

  // Create a memoized Set of active edge IDs
  const activeEdgeIds = useMemo(() => {
    const edgeIds = new Set<string>();
    let currentId: string | undefined = selectedId;

    // Walk up the tree from the selected node
    while (currentId) {
      const parentId = parentMap.get(currentId);
      if (!parentId) {
        break; // Reached the root
      }
      
      // Add the edge ID (e.g., "root-child-a") to the Set
      edgeIds.add(`${parentId}-${currentId}`);
      
      // Move up to the parent
      currentId = parentId;
    }
    return edgeIds;
  }, [selectedId]); // This recalculates whenever selectedId changes

  // Get the data for the right-side display
  const nodesToDisplay = useCallback(() => {
    const ancestors: TreeNodeData[] = [];
    let currentId: string | undefined = selectedId;

    while (currentId) {
      const data = nodeDataMap.get(currentId);
      if (data) {
        ancestors.push(data);
      }
      currentId = parentMap.get(currentId);
    }
    return ancestors.reverse(); // Reverse to show root first
  }, [selectedId])();

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-white mt-4">
      
      {/* Left Side: SVG Tree */}
      <div className="md:w-1/2 w-full flex items-start justify-center h-">
        <svg
          viewBox="0 0 500 390" // Adjusted viewBox height for more vertical space
          className="w-full max-w-lg"
          style={{ userSelect: "none" }}
        >
          {/* 1. Draw all the lines */}
          <g className="lines">
            {svgEdges.map((edge) => {
              const sourcePos = getNodeCenter(edge.sourceId).bottom;
              const targetPos = getNodeCenter(edge.targetId).top;
              
              const edgeId = `${edge.sourceId}-${edge.targetId}`;
              const isActive = activeEdgeIds.has(edgeId);

              return (
                <line
                  key={edgeId}
                  x1={sourcePos!.x}
                  y1={sourcePos!.y}
                  x2={targetPos!.x}
                  y2={targetPos!.y}
                  stroke={isActive ? "#2563eb" : "#9ca3af"} // blue-600 or gray-400
                  strokeWidth={isActive ? 4 : 2}
                  strokeDasharray={isActive ? "9 6" : "9 9"}
                  style={{ transition: "all 0.3s ease-in-out" }}
                />
              );
            })}
          </g>

          {/* 2. Draw all the nodes (circles and text) */}
          <g className="nodes">
            {svgNodes.map((node) => {
              const isSelected = node.id === selectedId;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x} // Center X
                    cy={node.y} // Center Y
                    r={NODE_RADIUS} // Radius
                    fill={isSelected ? "#dbeafe" : "#ffffff"} // blue-100 or white
                    stroke={isSelected ? "#2563eb" : "#e5e7eb"} // blue-600 or gray-200
                    strokeWidth={2}
                  />
                  <text
                    x={node.x} // Center X
                    y={node.y} // Center Y
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? "#1e40af" : "#374151"} // blue-800 or gray-700
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

      {/* Right Side: Display (Unchanged) */}
      <div className="md:w-1/2 w-full">
        {nodesToDisplay.map((data, index) => (
          <div
            key={index}
            className={`
              ${index > 0 ? "mt-6 border-t border-gray-200 pt-6" : ""}
            `}
          >
            <h2 className="text-2xl font-bold text-gray-800">{data.longHeader}</h2>
            <p className="mt-2 text-md text-gray-600">{data.paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
}