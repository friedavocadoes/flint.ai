"use client";
import { Button } from "@/components/ui/button";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { motion } from "motion/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* 1. Added a relative container with h-screen or custom height to bound the canvas */}
      <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center">
        <ShaderGradientCanvas
          style={{
            position: "absolute",
            inset: 0, // Tells the canvas to fill exactly 100% of this parent container
            zIndex: 0, // Keeps it firmly behind the text
          }}
          pointerEvents="none"
          lazyLoad
        >
          <ShaderGradient
            control="query"
            cDistance={4.4}
            grain="off"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.5&cAzimuthAngle=180&cDistance=1.1&cPolarAngle=90&cameraZoom=1&color1=%232d0000&color2=%2317425f&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=40&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=2.4&positionX=1.1&positionY=0.2&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=-10&rotationZ=60&shader=defaults&toggleAxis=true&type=waterPlane&uAmplitude=0&uDensity=4.6&uFrequency=5.5&uSpeed=0.2&uStrength=0.4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>

        {/* 2. Changed z-2 to relative z-10 so it explicitly sits on top of the z-0 canvas */}
        <div className="relative z-10 flex flex-col w-full">
          <motion.div
            className="mx-auto mt-40 mb-10 flex flex-col px-4"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 16px rgba(255,255,255,0.25)",
            }}
          >
            <h1 className="font-bold text-6xl text-center pb-5">
              Craft your Career Journey
            </h1>
            <p className="text-center font-semibold">
              This is a test description. Everything is plastic
            </p>
            <Button
              variant="outline"
              className="cursor-pointer mx-auto mt-16 font-bold"
              asChild
            >
              <Link href="/auth?tab=signup">Get Started</Link>
            </Button>
          </motion.div>
          <div className="h-40"></div>
        </div>
      </div>
    </>
  );
}
