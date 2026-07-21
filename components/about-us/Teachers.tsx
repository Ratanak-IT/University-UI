"use client";

import { Link as LinkIcon, Mail } from "lucide-react";
import { motion } from "framer-motion";

const teachers = [
  { name: "Mom Reaksmey", role: "Mentor", img: "/teacher/Mom reaksmey.jpg" },
  { name: "Chan Chhaya", role: "Mentor", img: "/teacher/Chan chhayya.jpg" },
  { name: "Kit Tara", role: "Mentor", img: "/teacher/Kit Tara.jpg" },
  { name: "Eung Lyzhia", role: "Mentor", img: "/teacher/Eung Lyzhia.jpg" },
];

function TeacherCard({
  name,
  role,
  img,
  index,
}: {
  name: string;
  role: string;
  img: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
      }}
      whileHover={{
        y: -10,
      }}
      className="group rounded-3xl border border-border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      {/* Teacher Image */}
      <motion.img
        src={img}
        alt={name}
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: index * 0.15 + 0.2,
        }}
        whileHover={{
          scale: 1.05,
        }}
        className="mx-auto h-44 w-44 rounded-full border-4 border-primary/10 object-cover transition group-hover:border-primary"
      />

      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.3 }}
        className="mt-6 text-2xl font-bold text-foreground"
      >
        {name}
      </motion.h3>

      <p className="mt-2 font-medium text-primary">
        {role}
      </p>


      {/* Social Buttons */}
      <div className="mt-6 flex justify-center gap-3">
        <motion.button
          whileHover={{
            scale: 1.15,
            rotate: 5,
          }}
          whileTap={{
            scale: 0.9,
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label={`${name}'s Profile`}
        >
          <LinkIcon className="h-5 w-5" />
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.15,
            rotate: -5,
          }}
          whileTap={{
            scale: 0.9,
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label={`Email ${name}`}
        >
          <Mail className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}


export default function Teachers() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Academic Excellence
          </span>

          <h2 className="mt-4 text-4xl font-bold text-foreground">
            Meet Our <span className="text-primary">Mentors</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Our experienced mentors provide guidance, knowledge, and support
            to help students achieve academic success and prepare for their
            future careers.
          </p>
        </motion.div>


        {/* Teacher Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <TeacherCard
              key={teacher.name}
              {...teacher}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}