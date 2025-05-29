"use client";
import type { PathwayData, Chat } from "./types";
import "reactflow/dist/style.css";
import CareerFlowchart from "@/components/ui/flow-viewer";
import axios from "axios";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Info, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?.id;
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${id}`)
      .then((res) => {
        console.log(res.data);
        setChats(res.data.chats);
      });
  }, []);

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  return (
    <>
      <AppSidebar
        chats={chats}
        loading={false}
        onChatSelect={setSelectedChatId}
      />
      <SidebarTrigger className="scale-120 mt-17 ml-2 cursor-pointer " />
      <div className="flex flex-col p-4 pl-1 mt-12 mb-20">
        {/* <h1 className="mx-auto text-2xl font-bold mb-4">Your Career Pathway</h1> */}
        <div className="mx-auto">
          {/* conditional display here */}
          {!selectedChat && <div className="text-lg">hello</div>}
          {selectedChat && (
            <div className="ml-6">
              {/* Title */}
              <h2 className="mx-auto text-2xl font-bold mb-4">
                {selectedChat.title
                  ? selectedChat.title
                  : selectedChat.promptData.role +
                    " at " +
                    selectedChat.promptData.targetCompanies}
                <PromptDisplay data={selectedChat.promptData} />
              </h2>

              {/* Description */}
              <div className="mb-2">{selectedChat.textual}</div>

              {/* Flow diagram */}
              {selectedChat.flowjson?.pathwayData && (
                <div className="h-100 w-100 absolute right-2 top-17">
                  <h1 className="mb-2 text-center font-bold text-2xl">
                    Flow Chart
                  </h1>
                  <CareerFlowchart data={selectedChat.flowjson.pathwayData} />
                </div>
              )}
            </div>
          )}
          {/* <div>
            {chats.map((chat) => (
              <pre>{JSON.stringify(chat)}</pre>
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
}

export function PromptDisplay({ data }: { data: Chat["promptData"] }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <Info />
          info
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-lg font-bold mb-3">About this Pathway</h4>
            <p className="text-sm">
              <span className="font-semibold">Role: </span> {data.role}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Target Companies: </span>{" "}
              {data.targetCompanies}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Expertise: </span>{" "}
              {data.expertise}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Skill Level: </span>{" "}
              {data.skillLevel}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Weak Areas: </span>{" "}
              {data.weakAreas}
            </p>
            <p className="text-sm">
              <span className="font-bold">Time Commitment: </span>{" "}
              {data.timeCommitment}
            </p>

            {data.extraRemarks && (
              <div className="flex items-center pt-2">
                <ListPlus className="mr-2 h-4 w-4 opacity-70" />
                {/* <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "} */}
                <span className="text-xs text-muted-foreground">
                  {data.extraRemarks}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
