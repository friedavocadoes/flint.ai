"use client";
import { useUserContext } from "@/context/userContext";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboBox } from "@/components/ComboBox";
import {
  Loader2,
  Target,
  Building2,
  Sparkles,
  ShieldAlert,
  Lightbulb,
  Rocket,
  Globe2,
  MapPin,
  GraduationCap,
  Briefcase,
  Coins,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  getPrioritizedCountries,
  getCurrencyForCountry,
  EDUCATION_LEVELS,
  GRADUATION_TIMELINES,
  CURRENT_STATUSES,
  YEARS_IN_DOMAIN,
  COMPANY_TYPES,
  OPPORTUNITY_TYPES,
} from "@/lib/locationMeta";

const prioritizedCountries = getPrioritizedCountries();

type FormState = {
  // Step 1
  hasTargetCountry: string;
  targetCountry: string;
  // Step 2
  currentResidenceCountry: string;
  currentStatus: string;
  fieldOfStudy: string;
  educationLevel: string;
  graduationTimeline: string;
  currentRole: string;
  yearsInTargetDomain: string;
  // Step 3
  hasTargetRole: string; // yes | explore
  role: string;
  desiredField: string;
  hasTargetCompany: string; // yes | no
  targetCompanies: string;
  companyTypePreference: string[];
  targetSalary: string;
  salaryPeriod: string;
  opportunityType: string;
  workModePreference: string;
  // core
  expertise: string;
  weakAreas: string;
  extraRemarks: string;
};

export function PromptForm({
  onChatCreated,
}: {
  onChatCreated?: (id: string) => void;
}) {
  const { user } = useUserContext();
  const [step, setStep] = useState(1);
  const [hours, setHours] = useState(4);
  const [skillLevel, setSkillLevel] = useState(5);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    hasTargetCountry: "",
    targetCountry: "",
    currentResidenceCountry: "",
    currentStatus: "",
    fieldOfStudy: "",
    educationLevel: "",
    graduationTimeline: "",
    currentRole: "",
    yearsInTargetDomain: "",
    hasTargetRole: "yes",
    role: "",
    desiredField: "",
    hasTargetCompany: "",
    targetCompanies: "",
    companyTypePreference: [],
    targetSalary: "",
    salaryPeriod: "yearly",
    opportunityType: "",
    workModePreference: "",
    expertise: "",
    weakAreas: "",
    extraRemarks: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const currency = useMemo(
    () =>
      getCurrencyForCountry(form.targetCountry || form.currentResidenceCountry),
    [form.targetCountry, form.currentResidenceCountry],
  );

  const update = (patch: Partial<FormState>) =>
    setForm((p) => ({ ...p, ...patch }));
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    update({ [name]: value } as any);
  };

  const skillLabel =
    skillLevel <= 2
      ? "Exploring"
      : skillLevel <= 4
        ? "Beginner"
        : skillLevel <= 6
          ? "Intermediate"
          : skillLevel <= 8
            ? "Advanced"
            : "Expert";
  const timeLabel =
    hours <= 2
      ? "Casual • light prep"
      : hours <= 5
        ? "Part-time • steady"
        : hours <= 8
          ? "Focused • sprint"
          : "Full-send • intense";
  const timeTone =
    hours <= 2
      ? "bg-emerald-500"
      : hours <= 5
        ? "bg-sky-500"
        : hours <= 8
          ? "bg-amber-500"
          : "bg-red-500";

  const isStudying = form.currentStatus === "studying";
  const isWorking = ["working", "freelance", "internship"].includes(
    form.currentStatus,
  );

  const toggleCompanyType = (type: string) => {
    setForm((p) => ({
      ...p,
      companyTypePreference: p.companyTypePreference.includes(type)
        ? p.companyTypePreference.filter((t) => t !== type)
        : [...p.companyTypePreference, type],
    }));
  };

  // per step validation
  const step1Valid =
    form.hasTargetCountry === "yes"
      ? form.targetCountry.trim().length > 1
      : form.hasTargetCountry === "no";
  const step2Valid = (() => {
    if (!form.currentResidenceCountry.trim()) return false;
    if (!form.currentStatus) return false;
    if (isStudying)
      return (
        form.fieldOfStudy.trim().length > 1 &&
        form.educationLevel &&
        form.graduationTimeline
      );
    if (isWorking)
      return form.currentRole.trim().length > 1 && form.yearsInTargetDomain;
    return true; // seeking/break allow minimal
  })();
  const step3ValidCore = (() => {
    const roleOk =
      form.hasTargetRole === "yes"
        ? form.role.trim().length >= 2
        : form.desiredField.trim().length >= 2;
    const companyOk =
      form.hasTargetCompany === "yes"
        ? form.targetCompanies.trim().length >= 2
        : form.companyTypePreference.length > 0;
    const base =
      roleOk &&
      !!companyOk &&
      form.expertise.trim().length >= 2 &&
      form.weakAreas.trim().length >= 2;
    if (isStudying && !form.opportunityType) return false;
    return base;
  })();
  const isValid = step1Valid && step2Valid && step3ValidCore;

  const nextStep = () => {
    if (step === 1 && !step1Valid) {
      toast.warning("Tell us your target country preference");
      setTouched((s) => ({
        ...s,
        hasTargetCountry: true,
        targetCountry: true,
      }));
      return;
    }
    if (step === 2 && !step2Valid) {
      toast.warning("Fill where you are now to personalize");
      setTouched((s) => ({
        ...s,
        currentResidenceCountry: true,
        currentStatus: true,
        fieldOfStudy: true,
        currentRole: true,
      }));
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const createChat = async () => {
    if (!isValid) {
      setTouched({
        role: true,
        expertise: true,
        weakAreas: true,
        targetCountry: true,
        currentResidenceCountry: true,
      });
      toast.warning("Fill in the required fields");
      if (!step3ValidCore) setStep(3);
      else if (!step2Valid) setStep(2);
      else if (!step1Valid) setStep(1);
      return;
    }
    setLoading(true);
    try {
      const effectiveRole =
        form.hasTargetRole === "yes" ? form.role : form.desiredField;
      const effectiveCurrency = currency.code;
      const promptData: Record<string, any> = {
        // Step1
        targetCountry:
          form.hasTargetCountry === "yes" ? form.targetCountry : "",
        hasTargetCountry: form.hasTargetCountry,
        // Step2
        currentResidenceCountry: form.currentResidenceCountry,
        currentStatus: form.currentStatus,
        fieldOfStudy: form.fieldOfStudy,
        educationLevel: form.educationLevel,
        graduationTimeline: form.graduationTimeline,
        currentRole: form.currentRole,
        yearsInTargetDomain: form.yearsInTargetDomain,
        // Step3
        role: effectiveRole,
        roleSpecificity:
          form.hasTargetRole === "yes"
            ? "exact"
            : form.hasTargetRole === "field"
              ? "field"
              : "explore",
        desiredField: form.desiredField,
        targetCompanies:
          form.hasTargetCompany === "yes" ? form.targetCompanies : "",
        hasTargetCompany: form.hasTargetCompany,
        companyTypePreference: form.companyTypePreference.join(", "),
        targetSalary: form.targetSalary,
        salaryCurrency: effectiveCurrency,
        salaryPeriod: form.salaryPeriod,
        opportunityType: form.opportunityType,
        workModePreference: form.workModePreference,
        // core
        expertise: form.expertise,
        weakAreas: form.weakAreas,
        skillLevel: `${skillLevel.toString()} on 10`,
        timeCommitment: `${hours} hours a day`,
        extraRemarks: form.extraRemarks,
      };

      const aiResponse = await axios.post("/api/gemini", { promptData });
      if (aiResponse.data.error) {
        toast.error(
          `AI service error. ${aiResponse.data.error.name}. Try again later`,
        );
      } else {
        const userId = user?.id;
        const data = { user: userId, chat: { promptData } };
        axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat`, data)
          .then((res) => {
            const chatId = res.data.chats[res.data.chats.length - 1]._id;
            axios
              .put(
                `${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat/${chatId}`,
                aiResponse.data,
              )
              .then(() => {
                if (onChatCreated) onChatCreated(chatId);
                toast.success("Roadmap ready — let's ship it");
              });
          })
          .catch(() => {
            toast.warning(
              "failed to save promptData. (can be ignored if no further errors)",
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
    createChat();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="overflow-hidden border shadow-xl shadow-primary/5">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-amber-500 to-primary" />
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <span className="w-8 h-8 rounded-xl bg-primary text-primary-foreground grid place-items-center">
                    <Rocket className="w-4 h-4" />
                  </span>
                  Craft your career quest
                </CardTitle>
                <CardDescription className="mt-2 max-w-[52ch]">
                  3 quick steps. More context = brutally honest timeline and
                  market-real roadmap.
                </CardDescription>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-muted border">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> AI • 5–7
                quests
              </div>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold border-2 transition-all ${
                        step === n
                          ? "bg-primary text-primary-foreground border-primary shadow"
                          : step > n
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-muted text-muted-foreground border-muted-foreground/20"
                      }`}
                    >
                      {step > n ? <Check className="w-3.5 h-3.5" /> : n}
                    </div>
                    {n < 3 && (
                      <div
                        className={`w-8 h-0.5 ${step > n ? "bg-emerald-500" : "bg-muted"}`}
                      />
                    )}
                  </div>
                ))}
                <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
                  Step {step} of 3 •{" "}
                  {step === 1
                    ? "Where next"
                    : step === 2
                      ? "Where now"
                      : "Where target"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50 border">
                {currency.symbol} • {currency.code}{" "}
                {form.targetCountry && `→ ${form.targetCountry}`}
              </div>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 min-h-[380px]">
            {/* === STEP 1: Geo === */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Globe2 className="w-4 h-4 text-primary" /> Where next —
                  Target geography
                  <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    Step 1
                  </span>
                </div>

                <div className="rounded-xl border p-4 bg-card/50 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Do you have a specific country where you want to work?{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={form.hasTargetCountry}
                      onValueChange={(v) =>
                        update({
                          hasTargetCountry: v,
                          targetCountry: v === "no" ? "" : form.targetCountry,
                        })
                      }
                    >
                      <div className="grid sm:grid-cols-2 gap-2">
                        <Label className="flex items-center gap-2 rounded-xl border px-3 py-3 cursor-pointer hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <RadioGroupItem value="yes" /> Yes, I have a target
                          country
                        </Label>
                        <Label className="flex items-center gap-2 rounded-xl border px-3 py-3 cursor-pointer hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <RadioGroupItem value="no" /> No, open to anywhere
                        </Label>
                      </div>
                    </RadioGroup>
                    {touched.hasTargetCountry && !form.hasTargetCountry && (
                      <p className="text-xs text-red-500">Pick one</p>
                    )}
                  </div>

                  {form.hasTargetCountry === "yes" && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> Target country{" "}
                        <span className="text-red-500">*</span>
                        <span className="text-[11px] font-normal normal-case px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700">
                          Top sought-after pinned on top
                        </span>
                      </Label>
                      <ComboBox
                        dataArray={prioritizedCountries}
                        dataName="country"
                        setterFunc={(v) => update({ targetCountry: v })}
                      />
                      {form.targetCountry ? (
                        <p className="text-xs text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Target:{" "}
                          {form.targetCountry} • Salary will be in{" "}
                          {currency.code} ({currency.symbol})
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          USA, UAE, India, Singapore, Japan, UK… are pinned at
                          top then A→Z
                        </p>
                      )}
                    </div>
                  )}

                  {form.hasTargetCountry === "no" && (
                    <div className="rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
                      Got it — we’ll keep it global and focus on remote / best
                      market for your role. You can still set residence next.
                    </div>
                  )}
                </div>

                <div className="rounded-xl border bg-muted/30 p-3 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Why we ask:
                    </span>{" "}
                    Visa, salary bands, hiring seasons and language differ by
                    country. This fixes the timeline from “6 months globally” to
                    “9-14 months for Singapore EP”.
                  </p>
                </div>
              </div>
            )}

            {/* === STEP 2: Current reality === */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="w-4 h-4 text-primary" /> Where now — Your
                  reality
                  <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-muted border">
                    Step 2
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Where do you currently live?{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <ComboBox
                      dataArray={prioritizedCountries}
                      dataName="residence country"
                      setterFunc={(v) => update({ currentResidenceCountry: v })}
                    />
                    {form.currentResidenceCountry && (
                      <p className="text-xs text-muted-foreground">
                        {form.currentResidenceCountry}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      What best describes you now?{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.currentStatus}
                      onValueChange={(v) => update({ currentStatus: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pick one" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENT_STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isStudying && (
                  <div className="rounded-xl border p-4 bg-card/50 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <GraduationCap className="w-4 h-4 text-violet-600" />{" "}
                      Studying details
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                          What are you studying?{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="fieldOfStudy"
                          placeholder="e.g. CS, Mechanical, Business"
                          value={form.fieldOfStudy}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Education level{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={form.educationLevel}
                          onValueChange={(v) => update({ educationLevel: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {EDUCATION_LEVELS.map((e) => (
                              <SelectItem key={e} value={e}>
                                {e}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        How long till you graduate?{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={form.graduationTimeline}
                        onValueChange={(v) => update({ graduationTimeline: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADUATION_TIMELINES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">
                        We’ll front-load pre-grad quests if &lt;6 months
                      </p>
                    </div>
                  </div>
                )}

                {isWorking && (
                  <div className="rounded-xl border p-4 bg-card/50 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Briefcase className="w-4 h-4 text-sky-600" /> Working
                      details
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        Current role / title{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        name="currentRole"
                        placeholder="e.g. Junior Frontend, Analyst"
                        value={form.currentRole}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        Years of experience{" "}
                        <span className="font-normal normal-case">
                          in the domain you want
                        </span>{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={form.yearsInTargetDomain}
                        onValueChange={(v) =>
                          update({ yearsInTargetDomain: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS_IN_DOMAIN.map((y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">
                        0 if you’re switching fields — we’ll add bridge stages
                      </p>
                    </div>
                  </div>
                )}

                {!isStudying && !isWorking && form.currentStatus && (
                  <div className="rounded-xl border p-4 bg-amber-50/30 dark:bg-amber-950/10 space-y-2">
                    <p className="text-sm font-medium">We’ll keep it broad</p>
                    <p className="text-xs text-muted-foreground">
                      No extra detail needed — target role + time you can give
                      will drive the tailoring.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* === STEP 3: Target & Calibration === */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="w-4 h-4 text-primary" /> Dream target +
                  calibration
                  <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    Step 3
                  </span>
                </div>

                {/* Role specificity */}
                <div className="rounded-xl border p-4 bg-card/50 space-y-4">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Do you have a specific role in mind?{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={form.hasTargetRole}
                    onValueChange={(v) => update({ hasTargetRole: v })}
                  >
                    <div className="grid sm:grid-cols-3 gap-2">
                      <Label className="flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-xs">
                        <RadioGroupItem value="yes" /> Yes — exact role
                      </Label>
                      <Label className="flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-xs">
                        <RadioGroupItem value="field" /> I know field, not role
                      </Label>
                      <Label className="flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-xs">
                        <RadioGroupItem value="explore" /> Not sure — help me
                      </Label>
                    </div>
                  </RadioGroup>

                  {form.hasTargetRole === "yes" ? (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="role"
                        className="text-xs uppercase tracking-wide text-muted-foreground"
                      >
                        Role you’re chasing{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Target className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <Input
                          id="role"
                          name="role"
                          placeholder="e.g. Staff SDE, Product Lead"
                          className="pl-9 h-11 bg-card"
                          value={form.role}
                          onChange={handleChange}
                          onBlur={() =>
                            setTouched((s) => ({ ...s, role: true }))
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        What field excites you?{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        name="desiredField"
                        placeholder="e.g. Data, Product, Design, Fintech"
                        value={form.desiredField}
                        onChange={handleChange}
                      />
                      <p className="text-[11px] text-muted-foreground">
                        We’ll suggest 2-3 concrete roles in stage 1
                      </p>
                    </div>
                  )}
                </div>

                {/* Company */}
                <div className="rounded-xl border p-4 bg-card/50 space-y-4">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Do you have a target company?{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={form.hasTargetCompany}
                    onValueChange={(v) => update({ hasTargetCompany: v })}
                  >
                    <div className="grid sm:grid-cols-2 gap-2">
                      <Label className="flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-xs">
                        <RadioGroupItem value="yes" /> Yes — I have companies
                      </Label>
                      <Label className="flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-xs">
                        <RadioGroupItem value="no" /> No — kind of company
                      </Label>
                    </div>
                  </RadioGroup>
                  {form.hasTargetCompany === "yes" ? (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <Input
                          name="targetCompanies"
                          placeholder="Google, Stripe, Series-A startups…"
                          className="pl-9 h-11 bg-card"
                          value={form.targetCompanies}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  ) : form.hasTargetCompany === "no" ? (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        What kind of company do you want?{" "}
                        <span className="font-normal normal-case text-[11px]">
                          (pick multiple)
                        </span>
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {COMPANY_TYPES.map((t) => {
                          const selected =
                            form.companyTypePreference.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => toggleCompanyType(t)}
                              className={`px-3 py-1.5 rounded-full text-xs border transition-all flex items-center gap-1.5 ${
                                selected
                                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                  : "bg-muted hover:bg-muted/80 border-muted-foreground/10"
                              }`}
                            >
                              {selected && <Check className="w-3 h-3" />} {t}
                            </button>
                          );
                        })}
                      </div>
                      {form.companyTypePreference.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[11px] text-muted-foreground mr-1">
                            Selected:
                          </span>
                          {form.companyTypePreference.map((c) => (
                            <span
                              key={c}
                              className="px-2.5 py-1 rounded-full text-xs bg-primary/10 border border-primary/20 text-primary flex items-center gap-1"
                            >
                              {c}
                              <button
                                type="button"
                                onClick={() => toggleCompanyType(c)}
                                className="ml-1 hover:text-primary/70"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Salary + mode */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5" /> Target salary
                      <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-muted border">
                        {currency.code}
                      </span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground max-w-[40px] truncate">
                          {currency.symbol}
                        </span>
                        <Input
                          name="targetSalary"
                          placeholder="e.g. 120000"
                          className="pl-12"
                          value={form.targetSalary}
                          onChange={handleChange}
                        />
                      </div>
                      <Select
                        value={form.salaryPeriod}
                        onValueChange={(v) => update({ salaryPeriod: v })}
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yearly">/ year</SelectItem>
                          <SelectItem value="monthly">/ month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      In {currency.code} — we’ll flag if unrealistic for{" "}
                      {form.targetCountry ||
                        form.currentResidenceCountry ||
                        "your target"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Work mode preference
                    </Label>
                    <Select
                      value={form.workModePreference}
                      onValueChange={(v) => update({ workModePreference: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Flexible" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible / Any</SelectItem>
                        <SelectItem value="remote">Remote only</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isStudying && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Looking for internship or job?{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.opportunityType}
                      onValueChange={(v) => update({ opportunityType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPPORTUNITY_TYPES.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Calibration — kept */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4 bg-card/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        Skill self-rating
                      </Label>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-medium">
                        {skillLevel}/10 • {skillLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-6">
                        0
                      </span>
                      <Slider
                        defaultValue={[5]}
                        value={[skillLevel]}
                        max={10}
                        step={1}
                        onValueChange={(e) => setSkillLevel(e[0])}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-6 text-right">
                        10
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl border p-4 bg-card/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        Time daily
                      </Label>
                      <span className="text-xs px-2.5 py-1 rounded-full border bg-background font-medium">
                        {hours}h
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-6">
                        0
                      </span>
                      <Slider
                        defaultValue={[4]}
                        value={[hours]}
                        max={12}
                        step={1}
                        onValueChange={(e) => setHours(e[0])}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-6 text-right">
                        12h
                      </span>
                    </div>
                    <div
                      className={`h-1.5 w-full rounded-full bg-muted overflow-hidden`}
                    >
                      <div
                        className={`h-full ${timeTone} transition-all`}
                        style={{ width: `${(hours / 12) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {timeLabel}
                    </p>
                  </div>
                </div>

                {/* Expertise / weak */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Your superpowers <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Sparkles className="w-4 h-4 absolute left-3 top-3 text-muted-foreground/60" />
                      <Textarea
                        name="expertise"
                        placeholder="Java, React, system design — what are you good at?"
                        className="pl-9 min-h-[88px] bg-card"
                        value={form.expertise}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Weak spots / blockers{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <ShieldAlert className="w-4 h-4 absolute left-3 top-3 text-muted-foreground/60" />
                      <Textarea
                        name="weakAreas"
                        placeholder="DSA under pressure, no referrals…"
                        className="pl-9 min-h-[88px] bg-card"
                        value={form.weakAreas}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Extra
                    context
                    <span className="font-normal normal-case text-[11px] px-2 py-0.5 rounded-full bg-muted border">
                      optional
                    </span>
                  </Label>
                  <Textarea
                    name="extraRemarks"
                    placeholder="Rejections, location constraints, deadlines…"
                    value={form.extraRemarks}
                    onChange={handleChange}
                    className="min-h-[96px] bg-card"
                  />
                </div>
              </div>
            )}
          </CardContent>

          <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
            <div className="rounded-xl border bg-muted/30 p-3 flex items-center justify-between gap-4">
              <div className="text-xs leading-relaxed">
                <span className="font-semibold">What you get:</span> 5–7 quests
                with realistic timeline, visa/market notes for{" "}
                {form.targetCountry || "target"}, salary sanity-check.
              </div>
              <Sparkles className="w-5 h-5 text-primary shrink-0 hidden sm:block" />
            </div>

            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : loading ? (
                <Button disabled className="ml-auto h-11 text-[15px] flex-1">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Forging your
                  roadmap…
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="ml-auto h-11 text-[15px] gap-2 shadow-lg shadow-primary/20 disabled:opacity-60 flex-1"
                >
                  <Rocket className="w-4 h-4" /> Build my roadmap with AI
                </Button>
              )}
            </div>
            {step === 3 && !isValid && (
              <p className="text-xs text-center text-muted-foreground">
                Fill * fields to unlock
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
