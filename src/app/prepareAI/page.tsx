"use client";
import type { Chat } from "./types";
import { useProtectedRoute } from "@/hooks/protectedRoute";
import "reactflow/dist/style.css";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/chat-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AlertDisplay from "@/components/alertDisplay";
import { PromptForm } from "@/components/promptForm"; // Input form
import { PromptDisplay } from "@/components/iDisplay"; // The i display thingy
import { Loader2 } from "lucide-react";
import { useUserContext } from "@/context/userContext";
import { InteractiveRoadmap } from "@/components/pathway/InteractiveRoadmap";

export default function PathwayPage() {
  const { user, loading: authLoading } = useUserContext();
  const { loading: guardLoading } = useProtectedRoute();
  const isAuthResolving = authLoading || guardLoading;
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshChats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const id = user.id;
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${id}`)
      .then((res) => {
        setChats(res.data.chats);
      })
      .catch(() => {
        setChats([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const selectedChat = useMemo(
    () => (selectedChatId ? chats.find((chat) => chat._id === selectedChatId) : undefined),
    [chats, selectedChatId]
  );

  useEffect(() => {
    if (isAuthResolving) return;
    refreshChats();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching external data is a valid effect that updates state
  }, [user, isAuthResolving, refreshChats]);

  if (isAuthResolving) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Checking session…</span>
      </div>
    );
  }

  if (!user) {
    // Redirect is in progress (useProtectedRoute) — avoid flash of protected content
    return null;
  }

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
            <div className="flex items-center gap-2 mb-3">
              <PromptDisplay data={selectedChat.promptData} />
              <AlertDisplay
                id={selectedChat._id}
                onDeleted={() => {
                  refreshChats();
                  setSelectedChatId(null);
                }}
              />
            </div>
            <InteractiveRoadmap
              chat={selectedChat}
              onUpdated={(updated) => {
                setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
