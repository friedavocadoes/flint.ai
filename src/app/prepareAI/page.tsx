"use client";
import type { Chat } from "./types";
import { useProtectedRoute } from "@/hooks/protectedRoute";
import "reactflow/dist/style.css";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/chat-sidebar";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
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
      <SidebarInset>
        <div className="flex flex-col p-4 md:p-6 lg:p-8 pt-14 pb-20 w-full max-w-[1400px] mx-auto">
        {/* conditional display here */}
        {!selectedChat ? (
          <div className="w-full">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Where do you want to go?</h1>
              <p className="text-sm md:text-[15px] text-muted-foreground mt-3 max-w-[60ch] mx-auto leading-relaxed">
                Answer 6 quick prompts. We&apos;ll forge a quest-based roadmap you can actually tick off — with honest chances, XP, and links you can open today.
              </p>
              {chats.length > 0 && !loading && (
                <p className="text-xs text-muted-foreground mt-2">
                  You have {chats.length} roadmap{chats.length !== 1 && "s"} • pick one from the sidebar or forge a new one
                </p>
              )}
            </div>

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
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <PromptDisplay data={selectedChat.promptData} />
              <AlertDisplay
                id={selectedChat._id}
                onDeleted={() => {
                  refreshChats();
                  setSelectedChatId(null);
                }}
              />
              <span className="ml-auto hidden sm:inline text-xs text-muted-foreground">
                {new Date(selectedChat.createdAt ?? "").toLocaleDateString()} • {selectedChat.promptData.role}
              </span>
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
      </SidebarInset>
    </>
  );
}
