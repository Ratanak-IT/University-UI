"use client";

import { Link as LinkIcon, Mail } from "lucide-react";
import { motion, Variants } from "framer-motion"; // <-- Imported Variants

const leads = [
  { name: "Thai Ratanak", role: "Leader", img: "/teams/thairatanak.jpg" },
  { name: "Kev Minea", role: "Sub Leader", img: "/teams/minea.png" },
];

const members = [
  { name: "Chhay Davin", role: "Frontend Developer", img: "/teams/chhaydavin.jpg" },
  { name: "Chit Chimy", role: "Frontend Developer", img: "/teams/chimy.jpg" },
  { name: "Kiry Ratanak", role: "Frontend Developer", img: "/teams/kiryratanak.jpg" },
  {
    name: "Chantol VireakRatanak",
    role: "Frontend Developer",
    img: "/teams/vireakratanak.jpg",
  },
  { name: "Chhom Titsela", role: "Frontend Developer", img: "/teams/sila.jpg" },
  { name: "Yorn Kannika", role: "Frontend Developer", img: "/teams/kanika.jpg" },
];

// Added Variants type here
const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Added Variants type here
const item: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function MemberCard({
  name,
  role,
  img,
}: {
  name: string;
  role: string;
  img: string;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-md transition-all duration-300 hover:border-primary/40 hover:shadow-2xl"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.img
          whileHover={{
            scale: 1.08,
            rotate: 2,
          }}
          transition={{ duration: 0.3 }}
          src={img}
          alt={name}
          className="h-40 w-40 rounded-full border-4 border-primary/20 object-cover shadow-lg"
        />

        <h4 className="mt-6 text-xl font-bold text-foreground">
          {name}
        </h4>

        <p className="mt-2 text-primary font-medium">
          {role}
        </p>

        <div className="mt-6 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label={`${name}'s Profile`}
          >
            <LinkIcon className="h-5 w-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label={`Email ${name}`}
          >
            <Mail className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  return (
    <section className="w-full bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border-t border-border pt-16 text-center"
        >
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Our Development Team
          </span>

          <h2 className="mt-4 text-4xl font-bold text-foreground">
            Meet the <span className="text-primary">UMS Team</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Meet the talented developers behind the University Management
            System (UMS). We are passionate about building a secure,
            user-friendly, and modern platform that enhances teaching,
            learning, and university administration.
          </p>
        </motion.div>

        {/* Leaders */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2"
        >
          {leads.map((lead) => (
            <MemberCard key={lead.name} {...lead} />
          ))}
        </motion.div>

        {/* Members */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {members.map((member) => (
            <MemberCard key={member.name} {...member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}