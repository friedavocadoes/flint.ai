"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Layers, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/ui/featureCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6 px-20">
      <section className="max-w-7xl mx-auto py-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400"
        >
          Craft Your Career Journey
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg max-w-2xl mb-8 text-slate-300"
        >
          We help you visualize, plan, and conquer your career path with
          interactive tools, custom strategies, and smart insights — tailored
          just for you.
        </motion.p>
        <Button className="px-8 py-4 text-lg bg-slate-700 hover:bg-slate-600 rounded-2xl shadow-xl">
          Get Started
        </Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto py-16">
        <FeatureCard
          icon={<Rocket size={32} />}
          title="Fast-track Growth"
          description="Skip the fluff. We focus on what accelerates your skills and lands you real opportunities."
        />
        <FeatureCard
          icon={<Layers size={32} />}
          title="Structured Pathways"
          description="Clear, modular career pathways designed for every level — from newbie to pro."
        />
        <FeatureCard
          icon={<Brain size={32} />}
          title="AI-Powered Insights"
          description="Get smart recommendations and tailored roadmaps built on your unique profile and goals."
        />
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto py-20"
      >
        <div className="rounded-3xl bg-slate-800/50 backdrop-blur p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 text-slate-200">
            Built for Modern Hustlers
          </h2>
          <p className="text-slate-400 mb-6">
            Whether you&apos;re a student, career switcher, or lifelong learner
            — our tools adapt to you. Visualize your journey, break it into
            actionable steps, and never lose track of your progress.
          </p>
          <Button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl">
            Explore More
          </Button>
        </div>
      </motion.section>
    </main>
  );
}
