"use client";
import type { Chat } from "./types";
import { useProtectedRoute } from "@/hooks/protectedRoute";
import "reactflow/dist/style.css";
import CareerFlowchart from "@/components/ui/flow-viewer";
import axios from "axios";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/chat-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import MarkdownViewer from "@/components/markDownViewer";
import AlertDisplay from "@/components/alertDisplay";
import { PromptForm } from "@/components/promptForm"; // Input form
import { PromptDisplay } from "@/components/iDisplay"; // The i display thingy
import { TriangleAlert } from "lucide-react";
import { useUserContext } from "@/context/userContext";

export default function PathwayPage() {
  useProtectedRoute();
  console.log("component mount");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined);

  // Update chat if chat id
  useEffect(() => {
    if (selectedChatId) {
      const currentChat = chats.find((chat) => chat._id === selectedChatId);
      setSelectedChat(currentChat);
    }
  }, [selectedChatId]);

  useEffect(() => {
    refreshChats();
  }, [user]);

  const refreshChats = async () => {
    if (user) {
      const id = user.id;
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${id}`)
        .then((res) => {
          setChats(res.data.chats);
          setLoading(false);
        });
    }
  };

  return (
    <>
      <AppSidebar
        chats={chats}
        loading={loading}
        onChatSelect={setSelectedChatId}
        selectedChatId={selectedChatId}
      />
      <SidebarTrigger className="scale-120 mt-17 ml-2 cursor-pointer " />
      <div className="flex flex-col p-4 pl-1 mt-12 mb-20 w-full">
        {/* conditional display here */}
        {!selectedChat ? (
          <div className="ml-6">
            {/* Title */}
            <h2 className="mx-auto text-2xl font-bold mb-4">
              Create a new Pathway
            </h2>

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
        ) : (
          <div className="ml-3 md:ml-6">
            <div className="md:w-3/5">
              {/* Title */}
              <h2 className="flex flex-col md:flex-row items-center mx-auto text-2xl font-bold mb-4">
                {selectedChat.title}

                <div className="flex self-start -ml-4 md:ml-0">
                  <PromptDisplay data={selectedChat.promptData} />
                  <div className="mt-2">
                    {/* delete button */}
                    <AlertDisplay
                      id={selectedChat._id}
                      onDeleted={() => {
                        refreshChats();
                        setSelectedChatId(null);
                      }}
                    />
                  </div>
                </div>

                {/* display flow error on phones */}
                <div className="md:hidden flex self-start items-center mt-2">
                  <TriangleAlert className="w-4 text-amber-400" />
                  <p className="text-xs font-mono text-amber-400 ml-2">
                    Flow diagram not viewable on phone!
                  </p>
                </div>
              </h2>

              {/* Description */}
              <div className="-ml-6 md:ml-0 mb-2">
                {/* {selectedChat.textual} */}

                <MarkdownViewer content={selectedChat.textual} />
              </div>
            </div>

            {/* Flow diagram */}
            {selectedChat.flowjson?.pathwayData && (
              <div className="hidden md:block h-3/4 w-1/4 fixed right-12 top-17">
                <h1 className="mb-2 text-center font-bold text-2xl">
                  Flow Chart
                </h1>
                <CareerFlowchart data={selectedChat.flowjson.pathwayData} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
