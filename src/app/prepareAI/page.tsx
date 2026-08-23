"use client";
import type { Chat } from "./types";
import { useProtectedRoute } from "@/hooks/protectedRoute";
import "reactflow/dist/style.css";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/chat-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import AlertDisplay from "@/components/alertDisplay";
import { PromptForm } from "@/components/promptForm";
import { PromptDisplay } from "@/components/iDisplay";
import { ChartNetwork, CircleFadingArrowUp, Loader2, PanelLeft, Plus } from "lucide-react";
import { useUserContext } from "@/context/userContext";
import { InteractiveRoadmap } from "@/components/pathway/InteractiveRoadmap";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import routes from "@/content/routes";

export default function PathwayPage() {
  const { user, loading: authLoading } = useUserContext();
  const { loading: guardLoading } = useProtectedRoute();
  const isAuthResolving = authLoading || guardLoading;
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const refreshChats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const id = user.id;
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${id}`)
      .then((res) => setChats(res.data.chats))
      .catch(() => setChats([]))
      .finally(() => setLoading(false));
  }, [user]);

  const selectedChat = useMemo(
    () => (selectedChatId ? chats.find((chat) => chat._id === selectedChatId) : undefined),
    [chats, selectedChatId],
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

  if (!user) return null;

  return (
    <>
      {/*
        The global Navbar owns the mobile (right-side) drawer. Keep the
        PrepareAI history sidebar desktop-only so it doesn't mount a second
        mobile Sheet against the same SidebarProvider/openMobile state.
      */}
      <div className="hidden md:block">
        <AppSidebar
          chats={chats}
          loading={loading}
          onChatSelect={setSelectedChatId}
          selectedChatId={selectedChatId}
        />
      </div>
      <SidebarInset>
        <div className="flex flex-col p-4 md:p-6 lg:p-8 !pt-14 pb-20 w-full max-w-[1400px] mx-auto">
          {/* Mobile history trigger — independent Sheet so it doesn't collide with the global right drawer */}
          <div className="md:hidden flex items-center justify-between gap-2 mb-4">
            <Sheet open={mobileHistoryOpen} onOpenChange={setMobileHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-full shadow-sm">
                  <PanelLeft className="h-4 w-4" />
                  History
                  {chats.length > 0 && !loading && (
                    <span className="bg-muted px-1.5 py-0.5 rounded-full text-[11px] font-medium">{chats.length}</span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[86vw] max-w-[320px] p-0 flex flex-col">
                <SheetHeader className="border-b p-4 text-left">
                  <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
                    <PanelLeft className="h-4 w-4" /> History
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-auto p-3 space-y-4">
                  {/* New plan */}
                  <button
                    onClick={() => {
                      setSelectedChatId(null);
                      setMobileHistoryOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm font-medium shadow-sm transition hover:bg-accent"
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    Plan a new career
                  </button>

                  {/* Recent */}
                  <div>
                    <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Recent Pathways</p>
                    <div className="flex flex-col gap-1">
                      {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-9 animate-pulse rounded-lg bg-muted/60" />
                          ))
                        : [...chats].reverse().length === 0
                          ? <p className="px-2 py-6 text-center text-xs text-muted-foreground">No roadmaps yet. Forge your first one.</p>
                          : [...chats].reverse().map((chat) => {
                              const label = chat.title ? chat.title : `${chat.promptData.role} at ${chat.promptData.targetCompanies}`;
                              const isActive = chat._id === selectedChatId;
                              return (
                                <button
                                  key={chat._id}
                                  onClick={() => {
                                    setSelectedChatId(chat._id);
                                    setMobileHistoryOpen(false);
                                  }}
                                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${isActive ? "bg-accent font-medium" : "hover:bg-accent/60"}`}
                                  title={label}
                                >
                                  <ChartNetwork className="h-4 w-4 shrink-0 text-muted-foreground" />
                                  <span className="truncate">{label}</span>
                                </button>
                              );
                            })}
                    </div>
                  </div>
                </div>

                <div className="border-t p-3">
                  <Link
                    href={routes.sub}
                    onClick={() => setMobileHistoryOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <CircleFadingArrowUp className="h-4 w-4" />
                    Upgrade to pro
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            {selectedChat && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedChatId(null)} className="gap-1.5">
                <Plus className="h-4 w-4" /> New
              </Button>
            )}
          </div>
          {!selectedChat ? (
            <div className="w-full">
              <div className="max-w-3xl mx-auto text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Where do you want to go?</h1>
                <p className="text-sm md:text-[15px] text-muted-foreground mt-3 max-w-[60ch] mx-auto leading-relaxed">
                  Answer 6 quick prompts. We&apos;ll forge a quest-based roadmap you can actually tick off — with honest chances, XP, and links you can open today.
                </p>
                {chats.length > 0 && !loading && (
                  <p className="text-xs text-muted-foreground mt-2">
                    You have {chats.length} roadmap{chats.length !== 1 && "s"} • pick one from History or forge a new one
                  </p>
                )}
              </div>

              <PromptForm
                onChatCreated={async (newChatId: string) => {
                  const userString = localStorage.getItem("user");
                  if (!userString) return;
                  const storedUser = JSON.parse(userString);
                  const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chats/${storedUser.id}`,
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
