import type { PathwayData } from "./types";
import "reactflow/dist/style.css";
import CareerFlowchart from "@/components/ui/flow-viewer";

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

const chats = [
  {
    id: 123,
    title: "this is a heading",
    textual: "hello",
    flowjson: {
      pathwayData: {
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
      },
      structData: {
        nodes: [
          {
            id: "1748419778470",
            data: { label: "New Node 1748419778470" },
            position: { x: -138.88270248023053, y: -45.1158518623551 },
            width: 150,
            height: 57,
            selected: false,
            positionAbsolute: { x: -138.88270248023053, y: -45.1158518623551 },
            dragging: false,
          },
          {
            id: "1748423135019",
            data: { label: "New Node 1748423135019" },
            position: { x: -126.05452386052525, y: 54.78637402357066 },
            width: 150,
            height: 57,
            selected: true,
            positionAbsolute: { x: -126.05452386052525, y: 54.78637402357066 },
            dragging: false,
          },
        ],
        edges: [
          {
            source: "1748419778470",
            sourceHandle: null,
            target: "1748423135019",
            targetHandle: null,
            animated: true,
            id: "reactflow__edge-1748419778470-1748423135019",
          },
        ],
      },
    },
    promptData: {
      role: "CEO",
      targetCompanies: "Google, Microsoft",
      expertise: "java, python, golang",
      weakAreas: "dsa",
      timeCommitment: "2 hours a day",
      skillLevel: "2/10",
      extraRemarks: "i want the easiest way to success",
    },
  },
];

export default function PathwayPage() {
  return (
    <div className="flex flex-col p-4 pl-1 mt-12 mb-20">
      <h1 className="mx-auto text-2xl font-bold mb-4">Your Career Pathway</h1>
      <div className="mx-auto h-100 w-100">
        {/* <CareerFlowchart data={geminiData} /> */}
      </div>
    </div>
  );
}
