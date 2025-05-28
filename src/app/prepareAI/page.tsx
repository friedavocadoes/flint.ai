"use client";

import React, { useCallback } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

// Define types for better structure
interface Stage {
  id: string;
  title: string;
}

interface Connection {
  from: string;
  to: string;
}

interface PathwayData {
  stages: Stage[];
  connections: Connection[];
}

const geminiData: PathwayData = {
  stages: [
    { id: "1", title: "Start: Learn DSA" },
    { id: "2", title: "Practice LeetCode" },
    { id: "3", title: "Build Projects" },
    { id: "4", title: "Prepare for Interviews" },
  ],
  connections: [
    { from: "1", to: "2" },
    { from: "2", to: "3" },
    { from: "3", to: "4" },
  ],
};

export default function PathwayPage() {
  return (
    <div className="p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Your Career Pathway</h1>
      <CareerFlowchart data={geminiData} />
    </div>
  );
}

// Add types to props
function CareerFlowchart({ data }: { data: PathwayData }) {
  // Arrange nodes horizontally with equal spacing
  const nodeSpacingX = 250;
  const nodeSpacingY = 100;
  const nodes = data.stages.map((stage, idx) => ({
    id: stage.id,
    data: { label: stage.title },
    position: { x: idx * nodeSpacingX, y: nodeSpacingY },
  }));

  const edges = data.connections.map((conn) => ({
    id: `e${conn.from}-${conn.to}`,
    source: conn.from,
    target: conn.to,
    animated: true,
  }));

  const onNodeClick = useCallback((event, node) => {
    alert(`Clicked on: ${node.data.label}`);
  }, []);

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick}>
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
