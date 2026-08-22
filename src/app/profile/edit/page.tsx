"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, UserRound } from "lucide-react";
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

export default function EditProfile() {
  const { userInfo, loading, setMeInfo } = useUserInfo();
  const router = useRouter();
  const [nationality, setNationality] = useState("");
  const [role, setRole] = useState("");
  const [sex, setSex] = useState<"Male" | "Female" | "Other" | null>(null);
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && userInfo) {
      setNationality(userInfo.nationality ?? "");
      setRole(userInfo.role ?? "");
      setSex((userInfo.sex as "Male" | "Female" | "Other" | null) ?? null);
      setAge(userInfo.age ? String(userInfo.age) : "");
    }
  }, [loading, userInfo]);

  const handleSubmit = () => {
    const numericAge = Number(age);
    if (!nationality || !role || !sex || numericAge <= 0) {
      toast.error("Fill in all four details to save your profile");
      return;
    }

    setSaving(true);
    setMeInfo({ age: numericAge, role, nationality, sex });
    toast.success("Profile details updated");
    router.push("/profile");
  };

  if (loading) {
    return <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center pt-14 text-sm text-muted-foreground">Loading your profile…</main>;
  }

  return (
    <main className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden bg-background pt-14">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-3xl items-center px-5 py-10">
        <section className="w-full rounded-[28px] border border-border/60 bg-card/90 p-6 shadow-2xl shadow-primary/5 backdrop-blur-xl md:p-8">
          <button type="button" onClick={() => router.push("/profile")} className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to profile
          </button>

          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserRound className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Profile settings</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Update your details</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Keep your Flint recommendations and career tools tailored to you.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label className="text-xs font-semibold">Nationality</Label><ComboBox dataArray={countries} dataName="country" setterFunc={setNationality} /></div>
            <div className="space-y-2"><Label className="text-xs font-semibold">Current role</Label><ComboBox dataArray={roles} dataName="role" setterFunc={setRole} /></div>
            <div className="space-y-2"><Label htmlFor="age" className="text-xs font-semibold">Age</Label><Input id="age" type="number" min={1} max={100} placeholder="e.g. 21" value={age} onChange={(e) => setAge(e.target.value)} /></div>
            <div className="space-y-2"><Label className="text-xs font-semibold">Gender</Label><RadioGroup value={sex ?? undefined} onValueChange={(value: "Male" | "Female" | "Other") => setSex(value)} className="grid grid-cols-3 gap-2">{(["Male", "Female", "Other"] as const).map((value) => <Label key={value} htmlFor={`gender-${value}`} className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"><RadioGroupItem value={value} id={`gender-${value}`} />{value}</Label>)}</RadioGroup></div>
          </div>

          <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">Your Google name and profile photo are managed by Google.</p>
            <Button disabled={saving} onClick={handleSubmit} className="gap-2 rounded-xl px-5">{saving ? "Saving…" : "Save changes"}{saving ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
