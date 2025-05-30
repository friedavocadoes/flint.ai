"use client";
import type { PathwayData, Chat } from "./types";
import "reactflow/dist/style.css";
import CareerFlowchart from "@/components/ui/flow-viewer";
import axios from "axios";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Info, ListPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

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
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString == null) router.push("/login");
    else {
      const user: { id: string } | null = JSON.parse(userString);
      const id = user?.id;
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${id}`)
        .then((res) => {
          setChats(res.data.chats);
        });
    }
  }, []);

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  return (
    <>
      <AppSidebar
        chats={chats}
        loading={false}
        onChatSelect={setSelectedChatId}
        selectedChatId={selectedChatId}
      />
      <SidebarTrigger className="scale-120 mt-17 ml-2 cursor-pointer " />
      <div className="flex flex-col p-4 pl-1 mt-12 mb-20">
        {/* <h1 className="mx-auto text-2xl font-bold mb-4">Your Career Pathway</h1> */}
        <div className="mx-auto">
          {/* conditional display here */}
          {!selectedChat && (
            <div className="ml-6">
              {/* Title */}
              <h2 className="mx-auto text-2xl font-bold mb-4">
                Create a new Pathway
              </h2>
              <div>
                <PromptForm />
              </div>
            </div>
          )}

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
        </div>
      </div>
    </>
  );
}

export function PromptForm() {
  const [hours, setHours] = useState(4);
  const [skillLevel, setSkillLevel] = useState(5);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: "",
    targetCompanies: "",
    expertise: "",
    weakAreas: "",
    extraRemarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const callGeminiAPI = async (promptData: any) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/gemini", { promptData });
      // handle response as needed
      console.log(res.data);
      if (res.data.error) {
        alert(`AI service error. ${res.data.error.name}. Try again later`);
      }
    } catch (err) {
      alert(`Call failed with error: ${err}. Try submitting again`);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const promptData = {
      ...form,
      skillLevel: `${skillLevel.toString()} on 10`,
      timeCommitment: `${hours} hours a day`,
    };
    callGeminiAPI(promptData);
  };

  const formInfo = [
    {
      id: "role",
      placeholder: "CEO, Software Engg 1",
      text: "The role you are aiming for",
    },
    {
      id: "targetCompanies",
      placeholder: "Google, Microsoft, Meta",
      text: "Target company/ies",
    },
    {
      id: "expertise",
      placeholder: "Java, Team management",
      text: "Your most powerfull skills",
    },
    {
      id: "weakAreas",
      placeholder: "Time management, Vibe code",
      text: "What are your weak areas?",
    },
  ];

  return (
    <form className="flex flex-col mt-8" onSubmit={handleSubmit}>
      {/* text inputs */}
      <div className="grid grid-cols-2 space-y-3 space-x-10">
        {formInfo.map((data) => (
          <div className="space-y-2 w-70" key={data.id}>
            <Label htmlFor={data.id} className="text-md">
              {data.text}
            </Label>
            <Input
              id={data.id}
              name={data.id}
              type="text"
              placeholder={data.placeholder}
              className="mb-6 h-12"
              value={form[data.id as keyof typeof form]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      {/* skill level commitment */}
      <div className="flex flex-col items-center mt-4 mb-10">
        <div className="flex space-x-2 items-center w-full">
          <p>0</p>
          <Slider
            defaultValue={[5]}
            max={10}
            step={1}
            onValueChange={(e) => {
              setSkillLevel(e[0]);
            }}
          />
          <p>10</p>
        </div>
        <div>
          Your skill level on a scale of 10:{" "}
          <span className="font-bold">{skillLevel}</span>
        </div>
      </div>

      {/* hours slider */}
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 items-center w-full">
          <p>0</p>
          <Slider
            defaultValue={[4]}
            max={24}
            step={1}
            onValueChange={(e) => {
              setHours(e[0]);
            }}
          />
          <p>24</p>
        </div>
        <div>
          Hours in a day you can dedicate:{" "}
          <span className="font-bold">{hours}</span>
        </div>
      </div>

      {/* remarks input */}
      <div className="flex flex-col items-center mt-10">
        <div className="space-y-2 w-full">
          <Label
            htmlFor="extraRemarks"
            className="text-md text-center justify-center"
          >
            Any extra Notes for AI
          </Label>
          <Textarea
            id="extraRemarks"
            name="extraRemarks"
            placeholder="No salt in my egg"
            value={form.extraRemarks}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* submit button */}
      <div className="mx-auto mt-6">
        {loading ? (
          <Button disabled>
            <Loader2 className="animate-spin" />
            Loading
          </Button>
        ) : (
          <Button type="submit">Build a Roadmap with AI</Button>
        )}
      </div>
    </form>
  );
}

export function PromptDisplay({ data }: { data: Chat["promptData"] }) {
  const pData = [
    { name: "Role", inf: data.role },
    { name: "Target Companies", inf: data.targetCompanies },
    { name: "Expertise", inf: data.expertise },
    { name: "Skill Level", inf: data.skillLevel },
    { name: "Weak Ares", inf: data.weakAreas },
    { name: "Time Commitment", inf: data.timeCommitment },
  ];
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
            {pData.map((pd) => (
              <p className="text-sm">
                <span className="font-semibold">{pd.name}: </span> {pd.inf}
              </p>
            ))}
            {data.extraRemarks && (
              <div className="flex items-center pt-2">
                <ListPlus className="mr-2 h-4 w-4 opacity-70" />
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
