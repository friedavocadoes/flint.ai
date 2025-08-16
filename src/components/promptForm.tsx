"use client";
import { useUserContext } from "@/context/userContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// form that is used to make a new chat
export function PromptForm({
  onChatCreated,
}: {
  onChatCreated?: (id: string) => void;
}) {
  const { user } = useUserContext();
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

      if (aiResponse.data.error) {
        toast.error(
          `AI service error. ${aiResponse.data.error.name}. Try again later`
        );
      } else {
        // 2. Save promptData to backend (creates a new chat)
        const userId = user?.id;
        console.log(userId);
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
            toast.warning(
              "failed to save promptData. (can be ignored if no further errors)"
            );
          });
      }
    } catch (err) {
      toast.error(`Call failed with error: ${err}. Try submitting again`);
    } finally {
      setLoading(false);
    }
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
    <form
      className="flex flex-col mt-8 mr-6 md:mr-0 md:max-w-2/3"
      onSubmit={handleSubmit}
    >
      {/* text inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 space-y-3 md:space-x-10">
        {formInfo.map((data) => (
          <div className="space-y-2 md:w-[95%]" key={data.id}>
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
            Provide additional context to AI
          </Label>
          <Textarea
            id="extraRemarks"
            name="extraRemarks"
            placeholder="I'm currently in my 3rd year of CS at Caltech with very little experience..."
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
