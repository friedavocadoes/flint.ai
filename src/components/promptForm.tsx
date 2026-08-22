"use client";
import { useUserContext } from "@/context/userContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Target, Building2, Sparkles, Brain, ShieldAlert, Clock, Lightbulb, Rocket } from "lucide-react";
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const skillLabel =
    skillLevel <= 2 ? "Exploring" : skillLevel <= 4 ? "Beginner" : skillLevel <= 6 ? "Intermediate" : skillLevel <= 8 ? "Advanced" : "Expert";
  const timeLabel =
    hours <= 2 ? "Casual • light prep" : hours <= 5 ? "Part-time • steady" : hours <= 8 ? "Focused • sprint" : "Full-send • intense";
  const timeTone = hours <= 2 ? "bg-emerald-500" : hours <= 5 ? "bg-sky-500" : hours <= 8 ? "bg-amber-500" : "bg-red-500";

  const isValid = form.role.trim().length >= 2 && form.expertise.trim().length >= 2 && form.weakAreas.trim().length >= 2;

  const createChat = async (promptData: any) => {
    if (!isValid) {
      setTouched({ role: true, expertise: true, weakAreas: true });
      toast.warning("Fill in role, expertise and weak areas");
      return;
    }
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
        const data = {
          user: userId,
          chat: {
            promptData,
          },
        };

        axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat`, data)
          .then((res) => {
            // 3. Save AI data to backend
            const chatId = res.data.chats[res.data.chats.length - 1]._id;
            axios
              .put(
                `${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat/${chatId}`,
                aiResponse.data
              )
              .then(() => {
                // Notify parent to refetch and select this chat
                if (onChatCreated) onChatCreated(chatId);
                toast.success("Roadmap ready — let's ship it");
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="overflow-hidden border shadow-xl shadow-primary/5">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-amber-500 to-primary" />
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <span className="w-8 h-8 rounded-xl bg-primary text-primary-foreground grid place-items-center">
                  <Rocket className="w-4 h-4" />
                </span>
                Craft your career quest
              </CardTitle>
              <CardDescription className="mt-2 max-w-[52ch]">
                Tell us where you want to go and where you are now. We&apos;ll build a brutally honest, gamified roadmap with quests, XP, and real resources — not fluff.
              </CardDescription>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-muted border">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> AI • 5–7 quests
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* Section: Dream */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Target className="w-4 h-4 text-primary" /> Dream role
                <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  Step 1
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs tracking-wide uppercase text-muted-foreground">
                    Role you&apos;re chasing <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Target className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      id="role"
                      name="role"
                      placeholder="e.g. Staff SDE, Product Lead, Data Scientist"
                      className="pl-9 h-11 bg-card"
                      value={form.role}
                      onChange={handleChange}
                      onBlur={() => setTouched((s) => ({ ...s, role: true }))}
                      required
                    />
                  </div>
                  {touched.role && form.role.trim().length < 2 && (
                    <p className="text-xs text-red-500">Tell us the role (min 2 chars)</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetCompanies" className="text-xs tracking-wide uppercase text-muted-foreground">
                    Target companies <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      id="targetCompanies"
                      name="targetCompanies"
                      placeholder="Google, Stripe, Series-A startups…"
                      className="pl-9 h-11 bg-card"
                      value={form.targetCompanies}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: You now */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Brain className="w-4 h-4 text-primary" /> Where you are now
                <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-muted border">Step 2</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expertise" className="text-xs tracking-wide uppercase text-muted-foreground">
                    Your superpowers <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Sparkles className="w-4 h-4 absolute left-3 top-3 text-muted-foreground/60" />
                    <Textarea
                      id="expertise"
                      name="expertise"
                      placeholder="Java, React, system design — what are you actually good at?"
                      className="pl-9 min-h-[88px] bg-card"
                      value={form.expertise}
                      onChange={handleChange}
                      onBlur={() => setTouched((s) => ({ ...s, expertise: true }))}
                      required
                    />
                  </div>
                  {touched.expertise && form.expertise.trim().length < 2 && (
                    <p className="text-xs text-red-500">Add at least one strength</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weakAreas" className="text-xs tracking-wide uppercase text-muted-foreground">
                    Weak spots / blockers <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <ShieldAlert className="w-4 h-4 absolute left-3 top-3 text-muted-foreground/60" />
                    <Textarea
                      id="weakAreas"
                      name="weakAreas"
                      placeholder="DSA under pressure, low system-design depth, no referrals…"
                      className="pl-9 min-h-[88px] bg-card"
                      value={form.weakAreas}
                      onChange={handleChange}
                      onBlur={() => setTouched((s) => ({ ...s, weakAreas: true }))}
                      required
                    />
                  </div>
                  {touched.weakAreas && form.weakAreas.trim().length < 2 && (
                    <p className="text-xs text-red-500">Be honest — helps us personalize</p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3" /> We turn weak areas into explicit quests with resources. No judgment.
              </p>
            </div>

            {/* Section: Calibration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="w-4 h-4 text-primary" /> Calibration
                <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-muted border">Step 3</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border p-4 bg-card/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Skill self-rating</Label>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-medium">
                      {skillLevel}/10 • {skillLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">0</span>
                    <Slider
                      defaultValue={[5]}
                      value={[skillLevel]}
                      max={10}
                      step={1}
                      onValueChange={(e) => setSkillLevel(e[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-6 text-right">10</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Exploring</span>
                    <span>Expert</span>
                  </div>
                </div>

                <div className="rounded-xl border p-4 bg-card/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Time you can give daily</Label>
                    <span className="text-xs px-2.5 py-1 rounded-full border bg-background font-medium">{hours}h • {timeLabel.split("•")[0]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">0</span>
                    <Slider
                      defaultValue={[4]}
                      value={[hours]}
                      max={12}
                      step={1}
                      onValueChange={(e) => setHours(e[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-6 text-right">12h</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full bg-muted overflow-hidden`}>
                    <div className={`h-full ${timeTone} transition-all`} style={{ width: `${(hours / 12) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{timeLabel}</p>
                </div>
              </div>
            </div>

            {/* Section: Story */}
            <div className="space-y-3">
              <Label htmlFor="extraRemarks" className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Extra context for the AI
                <span className="font-normal normal-case text-[11px] px-2 py-0.5 rounded-full bg-muted border">optional but powerful</span>
              </Label>
              <Textarea
                id="extraRemarks"
                name="extraRemarks"
                placeholder="I'm in 3rd year CS at XYZ, no internships yet, family pressure, love open-source but hate leetcode pressure… The more specific, the better the quest line."
                value={form.extraRemarks}
                onChange={handleChange}
                className="min-h-[96px] bg-card"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Tip: mention past rejections, location, constraints, or deadlines</span>
                <span>{form.extraRemarks.length}/600</span>
              </div>
            </div>
          </CardContent>

          <div className="px-6 pb-6 pt-2">
            <div className="rounded-xl border bg-muted/30 p-3 flex items-center justify-between gap-4 mb-4">
              <div className="text-xs leading-relaxed">
                <span className="font-semibold">What you get:</span> 5–7 quests with tasks, curated links, honest chances, and a live XP roadmap you can check off.
              </div>
              <Sparkles className="w-5 h-5 text-primary shrink-0 hidden sm:block" />
            </div>

            {loading ? (
              <Button disabled className="w-full h-11 text-[15px]">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Forging your roadmap…
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isValid}
                className="w-full h-11 text-[15px] gap-2 shadow-lg shadow-primary/20 disabled:opacity-60"
              >
                <Rocket className="w-4 h-4" />
                Build my roadmap with AI
              </Button>
            )}
            {!isValid && <p className="text-xs text-center text-muted-foreground mt-2">Fill the * fields to unlock the button</p>}
          </div>
        </form>
      </Card>
    </div>
  );
}
