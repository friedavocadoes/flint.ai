"use client";
import type { Chat } from "./types";
import "reactflow/dist/style.css";
import CareerFlowchart from "@/components/ui/flow-viewer";
import axios from "axios";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import MarkdownViewer from "@/components/markDownViewer";
import AlertDisplay from "@/components/alertDisplay";
import { PromptForm } from "@/components/promptForm"; // Input form
import { PromptDisplay } from "@/components/iDisplay"; // The i display thingy

export default function PathwayPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // Mark as mounted on client
  }, []);

  useEffect(() => {
    // Only fetch and set loading=false after mount
    if (!mounted) return;
    const userString = localStorage.getItem("user");
    if (userString == null) {
      router.push("/login");
      return;
    }

    const user: { id: string } | null = JSON.parse(userString);
    const id = user?.id;
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${id}`)
      .then((res) => {
        setChats(res.data.chats);
        setLoading(false); // Only set loading false after mount
      });
  }, [mounted, router]);

  const refreshChats = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const user = JSON.parse(userString);
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${user.id}`
    );
    setChats(res.data.chats);
    setLoading(false);
    // Optionally, deselect the deleted chat
    setSelectedChatId(null);
  };

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
              <div className="w-3/5">
                {/* Title */}
                <h2 className="flex items-center mx-auto text-2xl font-bold mb-4">
                  {selectedChat.title
                    ? selectedChat.title
                    : selectedChat.promptData.role +
                      " at " +
                      selectedChat.promptData.targetCompanies}
                  <PromptDisplay data={selectedChat.promptData} />
                  <div className="mt-2">
                    {/* delete button */}
                    <AlertDisplay
                      id={selectedChat._id}
                      onDeleted={refreshChats}
                    />
                  </div>
                </h2>

                {/* Description */}
                <div className="mb-2">
                  {/* {selectedChat.textual} */}

                  <MarkdownViewer content={selectedChat.textual} />
                </div>
              </div>

              {/* Flow diagram */}
              {selectedChat.flowjson?.pathwayData && (
                <div className="h-3/4 w-1/4 fixed right-12 top-17">
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
