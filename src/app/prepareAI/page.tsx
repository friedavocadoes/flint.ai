"use client";

import React, { useCallback, useState, useEffect } from "react";
import type { Stage, MyConnection, PathwayData } from "./types";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";

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
    <div className="flex flex-col p-4 mt-20">
      <h1 className="mx-auto text-2xl font-bold mb-4">Your Career Pathway</h1>
      <div className="mx-auto w-100">
        <CareerFlowchart data={geminiData} />
      </div>
    </div>
  );
}

function CareerFlowchart({ data }: { data: PathwayData }) {
  const nodeSpacingX = 250;
  const nodeSpacingY = 100;

  // Build initial nodes & edges from data
  const initialNodes: Node[] = data.stages.map((stage, idx) => ({
    id: stage.id,
    data: { label: stage.title },
    position: { x: idx * nodeSpacingX, y: nodeSpacingY },
  }));

  const initialEdges: Edge[] = data.connections.map((conn) => ({
    id: `e${conn.from}-${conn.to}`,
    source: conn.from,
    target: conn.to,
    animated: true,
  }));

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Load from localStorage or fallback to initial
  useEffect(() => {
    const saved = localStorage.getItem("flowchartData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setNodes(parsed.nodes || initialNodes);
      setEdges(parsed.edges || initialEdges);
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    // save to backend logic, on updte display a notif
    localStorage.setItem("flowchartData", JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  const onNodeClick = useCallback((_, node) => {
    alert(`Clicked on: ${node.data.label}`);
  }, []);

  const onNodeDoubleClick = useCallback(
    (_, node) => {
      const newLabel = prompt("Edit node label:", node.data.label);
      if (newLabel !== null) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, label: newLabel } }
              : n
          )
        );
      }
    },
    [setNodes]
  );

  const addNode = () => {
    const newId = `${Date.now()}`; // unique id
    const newNode = {
      id: newId,
      data: { label: `New Node ${newId}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
        <button
          onClick={addNode}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 z-100 absolute"
        >
          Add Node
        </button>
      </ReactFlow>
    </div>
  );
}
