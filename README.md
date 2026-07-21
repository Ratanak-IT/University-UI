#  University Management System — Student & Teacher Web Portal

---

##  1. Project Overview & Goal

The **University Management System (UMS) Student & Teacher Web Portal** is an intuitive, responsive web application engineered with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

Designed to deliver an interactive experience for higher education institutions, this portal bridges students, instructors, and visitors. It features separate workspace dashboards for **Students** and **Teachers**, accompanied by public-facing marketing and information pages.

---

##  2. Module & Feature Specifications

###  1. Student Portal (`/dashboard/student`)
* **Student Dashboard (`/dashboard/student/dashboard`):** Overview of active classes, upcoming assignment deadlines, and performance metrics.
* **Coursework & Submissions (`/assignments`, `/courses/assignment`):** Assignment workspace featuring instructions, file dropzones, and status tracking.
* **Lesson & Course Hub (`/courses`, `/lessons`):** Streamable lecture content, module navigation, and downloadable resources.
* **Quiz & Examination Portal (`/quizzes`):** Timed quiz attempt interface with real-time question navigation.
* **Grades & Academic History (`/grades`):** Grade compilation, course score breakdowns, and semester GPAs.
* **Schedule & Timetable (`/timetable`):** Weekly interactive class schedules.
* **Attendance Tracking (`/attendance`):** Real-time student attendance history logging.
* **Profile & Notifications (`/profile`, `/notifications`):** Student account settings and real-time activity feed.

###  2. Teacher Portal (`/dashboard/teacher`)
* **Teacher Overview (`/overview`):** Central dashboard tracking class attendance snapshots, deadline reminders, and engagement analytics.
* **Assignment Engine (`/assignments`, `/assignments/create`, `/[assignmentId]`):** Creation tool for publishing coursework with file attachments, deadlines, and criteria.
* **Lesson Studio (`/lessons`, `/lessons/create-lesson`, `/[id]`):** Rich-text lesson builder and media attachment management.
* **Classroom Workspace (`/my-classroom`, `/[id]`):** Classroom rosters, announcement feeds, student comment threads, and invite code generation.
* **Student Roster & Monitoring (`/my-student`):** Directory tracking student progress and graduation statuses.
* **Quiz Creation & Preview (`/quiz`, `/create-quiz`, `/preview-quiz`):** Tool for building question banks, assigning score weighting, and testing timed attempts.
* **Gradebook & Attendance (`/grades`, `/attendance`):** Grading portal for evaluating coursework and logging attendance.

###  3. Public Marketing & Landing Pages (`/homepage`, `/about-us`)
* **Interactive Homepage (`/homepage`):** Hero section, category browser, featured courses, curriculum preview, instructor directory, and testimonials.
* **About Us Hub (`/about-us`):** Institutional mission, vision, team directory, and faculty introductions.

---

##  3. Project Achievements & Completion Metrics

| Domain / Layer | Completion Status | Percentage | Key Deliverables Completed |
| :--- | :---: | :---: | :--- |
| **UX Design & User Flows** | Completed | **95%** | User mapping for Student & Teacher dashboards, responsive page layouts, and wireframes. |
| **UI Design System** | Completed | **90%** | Tailwind theme system, Framer Motion animations, Lucide icons, and component libraries. |
| **Student Workspace** | Completed | **85%** | Next.js App Router pages for course management, timetable, grades, and profile views. |
| **Teacher Workspace** | Completed | **85%** | Quiz creation tools, lesson publishing, assignment management, and gradebook tables. |
| **Overall Frontend Status** | **MVP Stable** | **88.75%** | **Core student and teacher portals operational and ready for midterm evaluation.** |

---

##  4. Tech Stack & Dependencies

* **Framework:** Next.js 15+ (App Router)
* **Language:** TypeScript 5.x
* **Styling & Layout:** Tailwind CSS, PostCSS
* **Animation Engine:** Framer Motion
* **Iconography:** Lucide React Icons, React Icons
* **State & Data Handling:** Local mock API handlers (`lib/api`), dataset adapters (`lib/data`), and transcript calculators (`lib/transcript.ts`)

---