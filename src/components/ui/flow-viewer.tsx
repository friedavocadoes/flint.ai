"use client";

import { PathwayData } from "@/types/flow-viewer";
import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
} from "reactflow";
import { Button } from "./button";
import { PlusCircleIcon, Trash } from "lucide-react";

export default function CareerFlowchart({ data }: { data: PathwayData }) {
  const nodeSpacingX = 100;
  const nodeSpacingY = 100;

  // Build initial nodes & edges from data
  const initialNodes: Node[] = data.stages.map((stage, idx) => ({
    id: stage.id,
    data: { label: stage.title },
    position: { x: nodeSpacingX, y: idx * nodeSpacingY }, // vertical layout
  }));

  const initialEdges: Edge[] = data.connections.map((conn) => ({
    id: `e${conn.from}-${conn.to}`,
    source: conn.from,
    target: conn.to,
    animated: true,
  }));

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Load from localStorage or fallback to initial
  useEffect(() => {
    const saved = localStorage.getItem("flowchartData");
    if (saved) {
      // const parsed = JSON.parse(saved);
      // setNodes(parsed.nodes || initialNodes);
      // setEdges(parsed.edges || initialEdges);
      setNodes(initialNodes);
      setEdges(initialEdges);
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [data]);

  // Save to localStorage on every change
  useEffect(() => {
    // save to backend logic, on updte display a notif
    localStorage.setItem("flowchartData", JSON.stringify({ nodes, edges }));
    // console.log(nodes);
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

  // Track selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Delete selected node and its edges
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
  };

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
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      >
        {/* <MiniMap /> */}
        <Controls />
        <Background gap={20} />
      </ReactFlow>
      <div className="flex mt-2 gap-2 justify-center">
        <Button
          variant="secondary"
          onClick={addNode}
          className="cursor-pointer"
        >
          <PlusCircleIcon />
          Create Node
        </Button>

        <Button
          onClick={deleteSelectedNode}
          disabled={!selectedNodeId}
          variant="destructive"
          className={`cursor-pointer ${
            selectedNodeId && "hover:opacity-90 transition duration-200"
          }`}
        >
          <Trash />
          Delete Node
        </Button>
      </div>
    </div>
  );
}
