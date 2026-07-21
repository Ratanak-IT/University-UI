"use client";

import { motion } from "framer-motion";
import { Mic, Trophy, Lightbulb } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-full grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 bg-background overflow-hidden">
      {/* Left copy */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-4xl font-extrabold leading-relaxed md:text-5xl md:leading-[1.3]"
        >
          <span className="text-primary">Empowering Education</span>
          <br />
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Through Smart Digital
          </span>
          <br />
          <span className="text-foreground">Management</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 flex flex-wrap gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md bg-muted px-6 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted/80"
          >
            Get Free Trial
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-md leading-7 text-muted-foreground"
        >
          Learn more about our University Management System and our mission
          to provide an efficient, secure, and user-friendly platform for
          managing academic activities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-wrap gap-8 text-sm text-foreground"
        >
          <motion.span
            whileHover={{ y: -3 }}
            className="flex items-center gap-2"
          >
            <Mic className="h-5 w-5 text-secondary" />
            Public Speaking
          </motion.span>

          <motion.span
            whileHover={{ y: -3 }}
            className="flex items-center gap-2"
          >
            <Trophy className="h-5 w-5 text-accent" />
            Career-Oriented
          </motion.span>

          <motion.span
            whileHover={{ y: -3 }}
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-5 w-5 text-secondary" />
            Creative Thinking
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Right illustration */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto flex h-[420px] w-[420px] max-w-full items-center justify-center"
      >
        {/* Rotating Border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-secondary/40"
        />

        {/* Glow Circle */}
        <div className="absolute inset-6 rounded-full bg-secondary/10 blur-xl" />

        {/* Floating Image */}
        <motion.img
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          whileHover={{
            scale: 1.05,
          }}
          src="/about-image.png"
          alt="Student holding a folder"
          className="relative z-10 h-72 w-72 rounded-full object-cover shadow-2xl"
        />
      </motion.div>
    </section>
  );
}