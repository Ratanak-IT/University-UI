import { Mail, Phone, MapPin } from "lucide-react";
import { 
  FaFacebookF, 
  FaTelegramPlane, 
  FaYoutube, 
  FaInstagram 
} from "react-icons/fa";

const columns = [
  {
    title: "Quick Links",
    links: ["Home", "Curriculum", "About Us","Contact us","FAQ"],
  },
  {
    title: "Services",
    links: ["Classroom", "Assignments", "Grades", "Quiz"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border pt-16 mt-auto">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 pb-12 lg:grid-cols-5">
        
        {/* Logos Section (Spans 2 columns on large screens) */}
        <div className="col-span-2 grid grid-cols-1 gap-10 sm:grid-cols-2">
          
          {/* ISTAD */}
          <div className="flex flex-col items-center text-center">
            <h4 className="mb-5 text-[24px] font-bold text-primary dark:text-gray-200">
              Organized By
            </h4>
            <img
              src="/logoISTAD.png"
              className="mb-6 h-24 object-contain"
              alt="ISTAD Logo"
            />
            <p className="text-[18px] leading-relaxed text-muted-foreground">
              Institute of Science and Technology
              <br />
              Advanced Development
            </p>
          </div>

          {/* Brand Logo (UML / UMS) */}
          <div className="flex flex-col items-center text-center">
            <h4 className="mb-5 text-[24px] font-bold text-primary dark:text-gray-200">
              UMS Platform
            </h4>
            <img
              src="/logo-rm.png"
              alt="UML Logo"
              className="mb-6 h-24 object-contain dark:hidden"
            />
            <img
              src="/logo-rm.png"
              alt="UML Logo"
              className="mb-6 hidden h-24 object-contain dark:block"
            />
            <p className="text-[18px] leading-relaxed text-muted-foreground">
              Building a secure, user-friendly,
              <br />
              and modern platform.
            </p>
          </div>
        </div>

        {/* Dynamic Link Columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-[24px] font-bold text-primary dark:text-gray-200 mb-5">{col.title}</h4>
            <ul className="space-y-2 text-[18px] text-muted-foreground dark:text-gray-200">
              {col.links.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="transition hover:text-primary block py-0.5"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Column with Lucide Icons */}
        <div>
          <h4 className="text-[24px] font-bold text-primary dark:text-gray-200 mb-5">Get in Touch</h4>
          <div className="space-y-4 text-sm text-muted-foreground dark:text-gray-200">
            <div className="flex items-start gap-2.5">
              <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
              <div>
                <p className="text-[20px] font-semibold text-primary dark:text-gray-200 tracking-wider">EMAIL</p>
                <a href="mailto:info.istad@gmail.com" className="hover:text-primary transition underline decoration-primary/40 text-[18px]">
                  info.istad@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
              <div>
                <p className="text-[20px] font-semibold text-primary dark:text-gray-200 tracking-wider">PHONE</p>
                <a href="tel:+18001234567" className="hover:text-primary transition underline decoration-primary/40 text-[18px]">
                  +1 (800) 123-4567
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
              <div>
                <p className="text-[20px] font-semibold text-primary dark:text-gray-200 tracking-wider">ADDRESS</p>
                <p className="text-[18px]">Phnom Penh, Cambodia</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3 pt-2">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-sky-500 hover:bg-sky-500 hover:text-white"
              >
                <FaTelegramPlane size={14} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-red-600 hover:bg-red-600 hover:text-white"
              >
                <FaYoutube size={14} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-pink-500 hover:bg-pink-500 hover:text-white"
              >
                <FaInstagram size={14} />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border py-6 text-sm text-muted-foreground/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 sm:flex-row text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} UML. All rights reserved. Designed by University Management System
          </span>
          <div className="mt-4 flex gap-5 sm:mt-0">
            <a href="#" className="hover:text-primary transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


// import { Mail, Phone, MapPin } from "lucide-react";
// import { 
//   FaFacebookF, 
//   FaTelegramPlane, 
//   FaYoutube, 
//   FaInstagram 
// } from "react-icons/fa";

// const columns = [
//   {
//     title: "Quick Links",
//     links: ["Home", "About Us", "Courses", "Contact us"],
//   },
//   {
//     title: "Services",
//     links: ["Courses", "Assignments", "Grades", "Faculty"],
//   },
//   // {
//   //   title: "Legal",
//   //   links: ["Terms of Service", "Privacy Policy", "Instructors", "Success Story"],
//   // },
// ];

// export default function Footer() {
//   return (
//     <footer className="bg-card text-card-foreground border-t border-border pt-16 mt-auto">
//       <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 pb-12 lg:grid-cols-6">
        
//         {/* Logos Section (Spans 2 columns on large screens) */}
//         <div className="col-span-2 grid grid-cols-1 gap-10 sm:grid-cols-2">
          
//           {/* ISTAD */}
//           <div className="flex flex-col items-center text-center">
//             <h4 className="mb-5 text-[24px] font-bold text-primary">
//               Organized By
//             </h4>
//             <img
//               src="/logoISTAD.png"
//               className="mb-6 h-24 object-contain"
//               alt="ISTAD Logo"
//             />
//             <p className="text-[18px] leading-relaxed text-muted-foreground">
//               Institute of Science and Technology
//               <br />
//               Advanced Development
//             </p>
//           </div>

//           {/* Brand Logo (UML / UMS) */}
//           <div className="flex flex-col items-center text-center">
//             <h4 className="mb-5 text-[24px] font-bold text-primary">
//               UMS Platform
//             </h4>
//             <img
//               src="/logo-rm.png"
//               alt="UML Logo"
//               className="mb-6 h-24 object-contain dark:hidden"
//             />
//             <img
//               src="/logo-rm.png"
//               alt="UML Logo"
//               className="mb-6 hidden h-24 object-contain dark:block"
//             />
//             <p className="text-[18px] leading-relaxed text-muted-foreground">
//               Building a secure, user-friendly,
//               <br />
//               and modern platform.
//             </p>
//           </div>
//         </div>

//         {/* Dynamic Link Columns */}
//         {columns.map((col) => (
//           <div key={col.title}>
//             <h4 className="text-[24px] font-bold text-primary mb-5">{col.title}</h4>
//             <ul className="space-y-2 text-[18px] text-muted-foreground">
//               {col.links.map((link) => (
//                 <li key={link}>
//                   <a 
//                     href="#" 
//                     className="transition hover:text-primary block py-0.5"
//                   >
//                     {link}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {/* Contact Column with Lucide Icons */}
//         <div>
//           <h4 className="text-[24px] font-bold text-primary mb-5">Get in Touch</h4>
//           <div className="space-y-4 text-sm text-muted-foreground">
//             <div className="flex items-start gap-2.5">
//               <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
//               <div>
//                 <p className="text-[20px] font-semibold text-primary tracking-wider">EMAIL</p>
//                 <a href="mailto:info.istad@gmail.com" className="hover:text-primary transition underline decoration-primary/40 text-[18px]">
//                   info.istad@gmail.com
//                 </a>
//               </div>
//             </div>

//             <div className="flex items-start gap-2.5">
//               <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
//               <div>
//                 <p className="text-[20px] font-semibold text-primary tracking-wider">PHONE</p>
//                 <a href="tel:+18001234567" className="hover:text-primary transition underline decoration-primary/40 text-[18px]">
//                   +1 (800) 123-4567
//                 </a>
//               </div>
//             </div>

//             <div className="flex items-start gap-2.5">
//               <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
//               <div>
//                 <p className="text-[20px] font-semibold text-primary tracking-wider">ADDRESS</p>
//                 <p className="text-[18px]">Phnom Penh, Cambodia</p>
//               </div>
//             </div>

//             {/* Social Links */}
//             <div className="mt-6 flex gap-3 pt-2">
//               <a
//                 href="#"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
//               >
//                 <FaFacebookF size={14} />
//               </a>
//               <a
//                 href="#"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-sky-500 hover:bg-sky-500 hover:text-white"
//               >
//                 <FaTelegramPlane size={14} />
//               </a>
//               <a
//                 href="#"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-red-600 hover:bg-red-600 hover:text-white"
//               >
//                 <FaYoutube size={14} />
//               </a>
//               <a
//                 href="#"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-pink-500 hover:bg-pink-500 hover:text-white"
//               >
//                 <FaInstagram size={14} />
//               </a>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Copyright Bar */}
//       <div className="border-t border-border py-6 text-sm text-muted-foreground/80">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 sm:flex-row text-center sm:text-left">
//           <span>
//             © {new Date().getFullYear()} UML. All rights reserved. Designed by University Management System
//           </span>
//           <div className="mt-4 flex gap-5 sm:mt-0">
//             <a href="#" className="hover:text-primary transition">Privacy Policy</a>
//             <a href="#" className="hover:text-primary transition">Terms of Service</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }