"use client";
import type { Chat } from "./types";
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
import MarkdownViewer from "@/components/markDownViewer";

export default function PathwayPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const userString = localStorage.getItem("user");
    if (userString == null) router.push("/login");
    else {
      const user: { id: string } | null = JSON.parse(userString);
      const id = user?.id;
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${id}`)
        .then((res) => {
          setChats(res.data.chats);
          setLoading(false);
        });
    }
  }, []);

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  return (
    <>
      <AppSidebar
        chats={chats}
        loading={loading}
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
                <PromptForm
                  onChatCreated={async (newChatId: string) => {
                    // Refetch chats
                    const userString = localStorage.getItem("user");
                    if (!userString) return;
                    const user = JSON.parse(userString);
                    const res = await axios.get(
                      `${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${user.id}`
                    );
                    setChats(res.data.chats);
                    setSelectedChatId(newChatId);
                  }}
                />
              </div>
            </div>
          )}

          {selectedChat && (
            <div className="ml-6">
              <div className="w-1/2">
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
                <div className="mb-2">
                  {/* {selectedChat.textual} */}

                  <MarkdownViewer content={selectedChat.textual} />
                </div>
              </div>

              {/* Flow diagram */}
              {selectedChat.flowjson?.pathwayData && (
                <div className="h-3/4 w-1/3 fixed right-12 top-17">
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

// form that is used to make a new chat
export function PromptForm({
  onChatCreated,
}: {
  onChatCreated?: (id: string) => void;
}) {
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

  const createChat = async (promptData: any) => {
    setLoading(true);
    try {
      // 1. Get results from AI
      const aiResponse = await axios.post("/api/gemini", { promptData });
      console.log(aiResponse.data);
      if (aiResponse.data.error) {
        alert(
          `AI service error. ${aiResponse.data.error.name}. Try again later`
        );
      } else {
        // 2. Save promptData to backend (creates a new chat)
        const loc = localStorage.getItem("user");
        const userId = JSON.parse(loc).id;

        const data = {
          user: userId,
          chat: {
            promptData,
          },
        };

        axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat`, data)
          .then((res) => {
            // console.log(res.data.chats[res.data.chats.length - 1]);
            // 3. Save AI data to backend
            const chatId = res.data.chats[res.data.chats.length - 1]._id;
            console.log(chatId);
            axios
              .put(
                `${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat/${chatId}`,
                aiResponse.data
              )
              .then(() => {
                // Notify parent to refetch and select this chat
                if (onChatCreated) onChatCreated(chatId);
              });
          })
          .catch(() => {
            alert(
              "failed to save promptData. (can be ignored if no further errors)"
            );
          });
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
    createChat(promptData);
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
              required
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

// the i display for info about a chat
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
              <p className="text-sm" key={pd.name}>
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
