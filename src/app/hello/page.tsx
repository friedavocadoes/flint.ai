"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Globe2, Sparkles, Target, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserInfo } from "@/hooks/useUserInfo";
import { ComboBox } from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import countries from "@/content/countries.json";
import roles from "@/content/roles.json";
import routes from "@/content/routes";

export default function Hello() {
  const { userInfo, loading, setMeInfo } = useUserInfo();
  const [nationality, setNationality] = useState("");
  const [role, setRole] = useState("");
  const [sex, setSex] = useState<"Male" | "Female" | "Other" | null>(null);
  const [age, setAge] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (loading || !userInfo) return;

    const complete = Boolean(
      userInfo.role &&
        userInfo.nationality &&
        userInfo.sex &&
        Number(userInfo.age) > 0,
    );

    if (complete) router.replace(routes.prepare);
  }, [loading, userInfo, router]);

  const handleSubmit = () => {
    const numericAge = Number(age);
    if (!nationality || !role || !sex || numericAge <= 0) {
      toast.error("Fill in all four details to continue");
      return;
    }

    setMeInfo({ age: numericAge, role, nationality, sex });
    router.push(routes.profile);
  };

  if (loading || (userInfo && userInfo.role && userInfo.nationality && userInfo.sex)) {
    return (
      <main className="min-h-[calc(100svh-3.5rem)] pt-14 flex items-center justify-center px-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-pulse" />
          Getting your Flint workspace ready…
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden bg-background pt-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-3.5rem)] max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[0.85fr_1.15fr] md:px-8 lg:gap-16">
        <section className="hidden md:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            One quick setup. Then you&apos;re in.
          </div>

          <h1 className="max-w-xl text-4xl font-bold tracking-tight lg:text-5xl">
            Let&apos;s make Flint work
            <span className="block bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
              for you.
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            Give us a little context about who you are. We&apos;ll use it to make
            your career tools, recommendations, and roadmaps actually relevant.
          </p>

          <div className="mt-8 space-y-4">
            {[
              [Target, "Smarter recommendations", "Your goals shape every suggestion."],
              [BriefcaseBusiness, "Career-aware tools", "Resume analysis and roadmaps fit your role."],
              [Globe2, "Personal context", "A few details help Flint understand your background."],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border bg-background/70 shadow-sm">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title as string}</p>
                  <p className="text-xs leading-5 text-muted-foreground">{text as string}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-xl justify-self-center">
          <div className="rounded-3xl border bg-card/90 p-5 shadow-2xl shadow-primary/5 backdrop-blur-xl md:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">A little about you</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  This takes less than a minute. No essay required.
                </p>
              </div>
              <span className="rounded-full border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                4 details
              </span>
            </div>

            <div className="mb-7 grid grid-cols-4 gap-1.5" aria-label="Setup progress">
              {[nationality, role, age, sex].map((value, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Nationality</Label>
                <ComboBox dataArray={countries} dataName="country" setterFunc={setNationality} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Current role</Label>
                <ComboBox dataArray={roles} dataName="role" setterFunc={setRole} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-xs font-semibold">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={1}
                  max={100}
                  placeholder="e.g. 21"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Gender</Label>
                <RadioGroup
                  value={sex ?? undefined}
                  onValueChange={(value: "Male" | "Female" | "Other") => setSex(value)}
                  className="grid grid-cols-3 gap-2"
                >
                  {(["Male", "Female", "Other"] as const).map((value) => (
                    <Label
                      key={value}
                      htmlFor={`gender-${value}`}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <RadioGroupItem value={value} id={`gender-${value}`} />
                      {value}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl border bg-muted/30 p-3.5">
              <p className="text-[11px] leading-4 text-muted-foreground">
                You can update these details later from your profile.
              </p>
              <Button onClick={handleSubmit} className="shrink-0 gap-2 rounded-xl px-5">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
