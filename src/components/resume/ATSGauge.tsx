"use client";

export function ATSGauge({ score }: { score: number }) {
  const s = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const color =
    s >= 80 ? "text-emerald-500" : s >= 65 ? "text-amber-500" : s >= 45 ? "text-orange-500" : "text-red-500";
  const bg =
    s >= 80 ? "bg-emerald-500" : s >= 65 ? "bg-amber-500" : s >= 45 ? "bg-orange-500" : "bg-red-500";
  const label = s >= 80 ? "Strong pass" : s >= 65 ? "Needs polish" : s >= 45 ? "At risk" : "Likely reject";
  const dash = (s / 100) * 226;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[132px] h-[132px]">
        <svg className="w-full h-full -rotate-90">
          <circle cx={66} cy={66} r={36} stroke="currentColor" className="text-muted" strokeWidth={10} fill="none" />
          <circle
            cx={66}
            cy={66}
            r={36}
            stroke="currentColor"
            className={color}
            strokeWidth={10}
            fill="none"
            strokeDasharray={`${dash} 226`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{s}</span>
          <span className="text-[10px] tracking-widest text-muted-foreground -mt-0.5">/ 100</span>
        </div>
      </div>
      <span className={`mt-2 text-xs font-semibold px-2.5 py-1 rounded-full border ${bg} text-white`}>{label}</span>
    </div>
  );
}
