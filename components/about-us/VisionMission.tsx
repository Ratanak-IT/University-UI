"use client";

import { GraduationCap, RefreshCw, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const missionItems = [
  {
    Icon: GraduationCap,
    title: "Expert Training",
    text: "Build up the capacity and career of IT experts through specialized training and mentoring.",
  },
  {
    Icon: RefreshCw,
    title: "Theory to Practice",
    text: "Bridge the gap between academic theory and industrial practice in the software sector.",
  },
  {
    Icon: Handshake,
    title: "Industry Connect",
    text: "Connect trainees to top-tier nationwide IT career opportunities.",
  },
];

export default function VisionMission() {
  return (
    <section className="bg-background py-16 text-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2">

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          whileHover={{ y: -8 }}
          className="rounded-2xl bg-card p-10 text-card-foreground shadow-lg"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold uppercase tracking-wide text-secondary"
          >
            The Future
          </motion.p>

          <h3 className="mt-2 text-3xl font-bold text-primary">
            Our Vision
          </h3>

          <p className="mt-4 leading-relaxed opacity-80 text-muted-foreground">
            To empower individuals with cutting-edge technological skills,
            fostering innovation, and contributing to the digital
            transformation of the nation through world-class IT education
            and research.
          </p>
        </motion.div>


        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          whileHover={{ y: -8 }}
          className="relative rounded-2xl bg-card p-10 text-card-foreground shadow-lg"
        >
          <span className="absolute left-0 top-8 h-24 w-1.5 rounded-r-full bg-secondary" />

          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Our Commitment
          </p>

          <h3 className="mt-2 text-3xl font-bold text-primary">
            Our Mission
          </h3>


          <ul className="mt-6 space-y-5">
            {missionItems.map(({ title, text, Icon }, index) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                className="flex gap-4"
              >
                <motion.span
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                  }}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary"
                >
                  <Icon className="h-5 w-5" />
                </motion.span>

                <div>
                  <p className="font-semibold text-primary">
                    {title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

      </div>
    </section>
  );
}