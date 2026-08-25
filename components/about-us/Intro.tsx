"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function Intro() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary"
          >
            <GraduationCap className="h-4 w-4" />
            Welcome to UMS
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold leading-tight text-foreground lg:text-5xl"
          >
            University
            <span className="text-primary"> Management </span>
            System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl text-lg leading-8 text-muted-foreground"
          >
            Manage students, teachers, courses, attendance, grades,
            schedules, and academic records through one modern,
            secure, and easy-to-use platform designed for digital
            universities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <button className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:scale-105 hover:opacity-90">
              Get Started
            </button>

            <button className="rounded-xl border border-border bg-card px-6 py-3 font-medium transition hover:scale-105 hover:bg-accent">
              Learn More
            </button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-8 pt-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-primary">10K+</h3>
              <p className="text-muted-foreground">Students</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-primary">500+</h3>
              <p className="text-muted-foreground">Teachers</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-primary">100+</h3>
              <p className="text-muted-foreground">Courses</p>
            </div>
          </motion.div>
        </motion.div>


        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 60 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: "easeOut",
          }}
          className="flex justify-center"
        >
          <motion.img
            src="/welcome.png"
            alt="University Management System"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full max-w-lg rounded-3xl border border-border bg-card object-cover shadow-2xl"
          />
        </motion.div>

      </div>
    </section>
  );
}