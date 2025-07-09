"use client";
import { Button } from "@/components/ui/button";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { motion } from "motion/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <ShaderGradientCanvas
        style={{
          position: "absolute",
          zIndex: 0,
          // inset: 0,
        }}
        pointerEvents="none"
        lazyLoad
      >
        <ShaderGradient
          control="query"
          cDistance={4.4}
          grain="off"
          // urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.1&cAzimuthAngle=180&cDistance=6&cPolarAngle=90&cameraZoom=1&color1=%232d0000&color2=%2317425f&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=10&frameRate=60&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1.4&positionX=1.1&positionY=0.2&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=-10&rotationZ=60&shader=defaults&toggleAxis=true&type=waterPlane&uAmplitude=0&uDensity=0.8&uFrequency=5.5&uSpeed=0.2&uStrength=1.8&uTime=0&wireframe=false"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.5&cAzimuthAngle=180&cDistance=1.1&cPolarAngle=90&cameraZoom=1&color1=%232d0000&color2=%2317425f&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=40&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=2.4&positionX=1.1&positionY=0.2&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=-10&rotationZ=60&shader=defaults&toggleAxis=true&type=waterPlane&uAmplitude=0&uDensity=4.6&uFrequency=5.5&uSpeed=0.2&uStrength=0.4&uTime=0&wireframe=false"
        />
      </ShaderGradientCanvas>
      <div className="flex flex-col z-2">
        {/* <motion.div className="top-2/5 left-1/2 -translate-x-1/2 z-5 "> */}
        <motion.div
          className="mx-auto mt-60 mb-10 flex flex-col px-4"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            // backdropFilter: "blur(8px)",
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
          >
            <Link href="/auth?tab=signup">Get Started</Link>
          </Button>
        </motion.div>
        <div className="h-50 md:h-30"></div>
      </div>
    </>
  );
}
