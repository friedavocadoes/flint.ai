"use client";
import { Button } from "@/components/ui/button";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <ShaderGradientCanvas style={{ position: "absolute", inset: 0, zIndex: 0 }} pointerEvents="none" lazyLoad>
        <ShaderGradient control="query" cDistance={4.4} grain="off" urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.5&cAzimuthAngle=180&cDistance=1.1&cPolarAngle=90&cameraZoom=1&color1=%232d0000&color2=%2317425f&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=40&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=2.4&positionX=1.1&positionY=0.2&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=-10&rotationZ=60&shader=defaults&toggleAxis=true&type=waterPlane&uAmplitude=0&uDensity=4.6&uFrequency=5.5&uSpeed=0.2&uStrength=0.4&uTime=0&wireframe=false" />
      </ShaderGradientCanvas>
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-5 pt-20 text-center md:pt-12">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-md"><Sparkles className="h-3.5 w-3.5 text-white/80" />Less career fluff. More useful moves.</motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease: "easeOut" }} style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.68) 38%, rgba(214,194,238,0.72) 68%, rgba(255,255,255,0.48) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", textShadow: "0 4px 30px rgba(255,255,255,0.18)" }}>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[84px]">Figure out your next move.<br /><span className="opacity-90">Then make it.</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-sm font-medium leading-6 text-white/65 sm:text-base md:text-lg">Plan a career path, sharpen your resume, and clean up your LinkedIn — whether you&apos;re starting out, switching lanes, or aiming higher.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} className="mt-10 flex flex-col items-center gap-3 sm:flex-row"><Button size="lg" className="group h-12 rounded-full bg-white px-7 font-semibold text-black shadow-xl shadow-black/20 hover:bg-white/90" asChild><Link href="/auth?tab=signup">Let&apos;s get into it <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></Button><span className="text-xs text-white/45">Pick a direction. We&apos;ll help with the rest.</span></motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.45 }} className="mt-16 flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium tracking-wide text-white/35 sm:gap-6"><span>CAREER PATHS</span><span className="h-px w-8 bg-white/20" /><span>ATS RESUME CHECKS</span><span className="h-px w-8 bg-white/20" /><span>LINKEDIN</span></motion.div>
      </div>
    </div>
  );
}
