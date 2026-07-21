// // features/assignments/form/InstructionsEditor.tsx

// "use client";

// import { useRef, useState, ChangeEvent, MouseEvent, useEffect } from "react";
// import {
//   Bold,
//   Italic,
//   Underline,
//   Image as ImageIcon,
//   Link2,
//   List,
//   ListOrdered,
//   RemoveFormatting,
//   Check,
//   X,
//   Upload,
// } from "lucide-react";

// interface InstructionsEditorProps {
//   value: string;
//   onChange: (html: string) => void;
// }

// export function InstructionsEditor({
//   value,
//   onChange,
// }: InstructionsEditorProps) {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Track cursor position so we don't lose it when clicking our custom menus
//   const [savedRange, setSavedRange] = useState<Range | null>(null);
  
//   // UI State for our custom inline prompts
//   const [promptMode, setPromptMode] = useState<"link" | "image" | "resize" | null>(null);
//   const [promptValue, setPromptValue] = useState("");
//   const [activeTarget, setActiveTarget] = useState<HTMLElement | null>(null);

//   // Sync initial value safely to prevent cursor jumping
//   useEffect(() => {
//     if (editorRef.current && !editorRef.current.innerHTML && value) {
//       editorRef.current.innerHTML = value;
//     }
//   }, [value]);

//   function saveCursor() {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       setSavedRange(selection.getRangeAt(0));
//     }
//   }

//   function restoreCursor() {
//     if (savedRange) {
//       const selection = window.getSelection();
//       selection?.removeAllRanges();
//       selection?.addRange(savedRange);
//     }
//     editorRef.current?.focus();
//   }

//   // Basic formatting execution (relies on ToolbarButton's preventDefault)
//   function execBasic(command: string, arg?: string) {
//     document.execCommand(command, false, arg);
//     onChange(editorRef.current?.innerHTML ?? "");
//   }

//   // Execution that requires restoring focus/cursor (for our custom prompts)
//   function execWithRestore(command: string, arg?: string) {
//     restoreCursor();
//     document.execCommand(command, false, arg);
//     onChange(editorRef.current?.innerHTML ?? "");
//     closePrompt();
//   }

//   function openPrompt(mode: "link" | "image") {
//     saveCursor();
//     setPromptMode(mode);
//     setPromptValue("");
//   }

//   function closePrompt() {
//     setPromptMode(null);
//     setPromptValue("");
//     setActiveTarget(null);
//   }

//   function handleApplyPrompt() {
//     if (!promptValue) {
//       closePrompt();
//       return;
//     }

//     if (promptMode === "link") {
//       if (activeTarget && activeTarget.tagName === "A") {
//         (activeTarget as HTMLAnchorElement).href = promptValue;
//         onChange(editorRef.current?.innerHTML ?? "");
//         closePrompt();
//       } else {
//         execWithRestore("createLink", promptValue);
//       }
//     } else if (promptMode === "image") {
//       execWithRestore("insertImage", promptValue);
//     } else if (promptMode === "resize" && activeTarget) {
//       activeTarget.style.width = promptValue;
//       onChange(editorRef.current?.innerHTML ?? "");
//       closePrompt();
//     }
//   }

//   // --- Local File Upload (Base64) ---
//   function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     restoreCursor();
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const base64 = event.target?.result as string;
//       document.execCommand("insertImage", false, base64);
//       onChange(editorRef.current?.innerHTML ?? "");
//     };
//     reader.readAsDataURL(file);
    
//     e.target.value = ""; // Reset input
//     closePrompt();
//   }

//   // --- Interactive Editing (Clicking existing links/images) ---
//   function handleEditorClick(e: MouseEvent<HTMLDivElement>) {
//     const target = e.target as HTMLElement;

//     if (target.tagName === "IMG") {
//       saveCursor();
//       setActiveTarget(target);
//       setPromptMode("resize");
//       setPromptValue(target.style.width || "100%");
//     } else if (target.tagName === "A") {
//       saveCursor();
//       setActiveTarget(target);
//       setPromptMode("link");
//       setPromptValue((target as HTMLAnchorElement).href);
//     }
//   }

//   return (
//     <div>
//       <span className="text-xs font-medium tracking-wide text-muted-foreground">
//         INSTRUCTIONS (OPTIONAL)
//       </span>

//       <input
//         type="file"
//         accept="image/*"
//         ref={fileInputRef}
//         onChange={handleFileUpload}
//         className="hidden"
//       />

//       <div className="mt-2 rounded-xl border border-border bg-background">
//         {/* Formatting Toolbar */}
//         <div className="flex items-center gap-1 border-b border-border px-3 py-2">
//           <ToolbarButton icon={<Bold className="h-4 w-4" />} onClick={() => execBasic("bold")} label="Bold" />
//           <ToolbarButton icon={<Italic className="h-4 w-4" />} onClick={() => execBasic("italic")} label="Italic" />
//           <ToolbarButton icon={<Underline className="h-4 w-4" />} onClick={() => execBasic("underline")} label="Underline" />
//           <span className="mx-1 h-5 w-px bg-border" />
//           <ToolbarButton icon={<List className="h-4 w-4" />} onClick={() => execBasic("insertUnorderedList")} label="Bulleted list" />
//           <ToolbarButton icon={<ListOrdered className="h-4 w-4" />} onClick={() => execBasic("insertOrderedList")} label="Numbered list" />
//           <span className="mx-1 h-5 w-px bg-border" />
          
//           <ToolbarButton icon={<Link2 className="h-4 w-4" />} onClick={() => openPrompt("link")} label="Insert link" />
//           <ToolbarButton icon={<ImageIcon className="h-4 w-4" />} onClick={() => openPrompt("image")} label="Insert image" />
          
//           <span className="flex-1" />
//           <ToolbarButton
//             icon={<RemoveFormatting className="h-4 w-4" />}
//             onClick={() => execBasic("removeFormat")}
//             label="Clear formatting"
//           />
//         </div>

//         {/* Inline Prompts */}
//         {promptMode && (
//           <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
//             {promptMode === "image" && (
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
//               >
//                 <Upload className="h-3 w-3" />
//                 Upload File
//               </button>
//             )}
            
//             <input
//               type="text"
//               autoFocus
//               value={promptValue}
//               onChange={(e) => setPromptValue(e.target.value)}
//               placeholder={
//                 promptMode === "link" ? "Enter URL..." : 
//                 promptMode === "image" ? "...or paste image URL" : 
//                 "Enter width (e.g., 100%, 300px)"
//               }
//               className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   handleApplyPrompt();
//                 } else if (e.key === "Escape") {
//                   closePrompt();
//                 }
//               }}
//             />
//             <button onClick={handleApplyPrompt} className="rounded p-1 text-green-600 hover:bg-green-100 dark:text-green-500 dark:hover:bg-green-950">
//               <Check className="h-4 w-4" />
//             </button>
//             <button onClick={closePrompt} className="rounded p-1 text-red-600 hover:bg-red-100 dark:text-red-500 dark:hover:bg-red-950">
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}

//         {/* Editor Area */}
//         <div
//           ref={editorRef}
//           contentEditable
//           suppressContentEditableWarning
//           onInput={(e) => onChange(e.currentTarget.innerHTML)}
//           onClick={handleEditorClick}
//           onBlur={saveCursor} // Save cursor when clicking away
//           data-placeholder="Share more details about the assignment..."
//           className="min-h-[280px] px-4 py-3 text-sm text-foreground focus:outline-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] [&_img]:cursor-pointer [&_img]:rounded-md [&_img]:border [&_img]:border-transparent hover:[&_img]:border-blue-500 [&_a]:cursor-pointer [&_a]:text-blue-500 [&_a]:underline"
//         />
//       </div>
//     </div>
//   );
// }

// function ToolbarButton({
//   icon,
//   onClick,
//   label,
// }: {
//   icon: React.ReactNode;
//   onClick: () => void;
//   label: string;
// }) {
//   return (
//     <button
//       type="button"
//       onMouseDown={(e) => e.preventDefault()} // CRITICAL FIX: Prevents focus stealing
//       onClick={onClick}
//       aria-label={label}
//       title={label}
//       className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
//     >
//       {icon}
//     </button>
//   );
// }

// features/assignments/form/InstructionsEditor.tsx

"use client";

import { useRef, useState, ChangeEvent, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Image as ImageIcon,
  Link2,
  List,
  ListOrdered,
  RemoveFormatting,
  Check,
  X,
  Upload,
} from "lucide-react";

interface InstructionsEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function InstructionsEditor({
  value,
  onChange,
}: InstructionsEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom prompt overlay state
  const [promptMode, setPromptMode] = useState<"link" | "image" | null>(null);
  const [promptValue, setPromptValue] = useState("");

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "cursor-pointer rounded-md border border-transparent hover:border-blue-500 max-w-full h-auto my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
    ],
    // Tiptap applies your Tailwind typography resets right here automatically!
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-4 py-3 text-sm text-foreground focus:outline-none " +
          "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 " +
          "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 " +
          "[&_li]:mt-1",
        "data-placeholder": "Share more details about the assignment...",
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content synchronized if 'value' changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  // --- Handle Custom Interactive Popups ---
  function openPrompt(mode: "link" | "image") {
    setPromptMode(mode);
    if (mode === "link" && editor?.isActive("link")) {
      setPromptValue(editor.getAttributes("link").href || "");
    } else {
      setPromptValue("");
    }
  }

  function closePrompt() {
    setPromptMode(null);
    setPromptValue("");
  }

  function handleApplyPrompt() {
    if (!promptValue) {
      if (promptMode === "link") editor.chain().focus().unsetLink().run();
      closePrompt();
      return;
    }

    if (promptMode === "link") {
      editor.chain().focus().setLink({ href: promptValue }).run();
    } else if (promptMode === "image") {
      editor.chain().focus().setImage({ src: promptValue }).run();
    }
    closePrompt();
  }

  // --- Local File Upload Setup (Base64) ---
  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      editor?.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
    
    e.target.value = ""; 
    closePrompt();
  }

  return (
    <div>
      <span className="text-xs font-medium tracking-wide text-muted-foreground">
        INSTRUCTIONS (OPTIONAL)
      </span>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="mt-2 rounded-xl border border-border bg-background">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 border-b border-border px-3 py-2">
          <ToolbarButton 
            icon={<Bold className="h-4 w-4" />} 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            active={editor.isActive("bold")}
            label="Bold" 
          />
          <ToolbarButton 
            icon={<Italic className="h-4 w-4" />} 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            active={editor.isActive("italic")}
            label="Italic" 
          />
          <ToolbarButton 
            icon={<UnderlineIcon className="h-4 w-4" />} 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            active={editor.isActive("underline")}
            label="Underline" 
          />
          
          <span className="mx-1 h-5 w-px bg-border" />
          
          <ToolbarButton 
            icon={<List className="h-4 w-4" />} 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            active={editor.isActive("bulletList")}
            label="Bulleted list" 
          />
          <ToolbarButton 
            icon={<ListOrdered className="h-4 w-4" />} 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            active={editor.isActive("orderedList")}
            label="Numbered list" 
          />
          
          <span className="mx-1 h-5 w-px bg-border" />
          
          <ToolbarButton 
            icon={<Link2 className="h-4 w-4" />} 
            onClick={() => openPrompt("link")} 
            active={editor.isActive("link")}
            label="Insert link" 
          />
          <ToolbarButton 
            icon={<ImageIcon className="h-4 w-4" />} 
            onClick={() => openPrompt("image")} 
            label="Insert image" 
          />
          
          <span className="flex-1" />
          <ToolbarButton
            icon={<RemoveFormatting className="h-4 w-4" />}
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            label="Clear formatting"
          />
        </div>

        {/* Dynamic Input Prompt Panel */}
        {promptMode && (
          <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
            {promptMode === "image" && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                <Upload className="h-3 w-3" />
                Upload File
              </button>
            )}
            
            <input
              type="text"
              autoFocus
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder={promptMode === "link" ? "Enter URL..." : "...or paste image URL"}
              className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyPrompt();
                } else if (e.key === "Escape") {
                  closePrompt();
                }
              }}
            />
            <button onClick={handleApplyPrompt} className="rounded p-1 text-green-600 hover:bg-green-100 dark:text-green-500 dark:hover:bg-green-950">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={closePrompt} className="rounded p-1 text-red-600 hover:bg-red-100 dark:text-red-500 dark:hover:bg-red-950">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tiptap Core Editor Viewport */}
        <div 
          onClick={(e) => {
            const target = e.target as HTMLElement;
            // Native Node selection for images/links on click
            if (target.tagName === "IMG") {
              openPrompt("image");
              setPromptValue(target.getAttribute("src") || "");
            } else if (target.tagName === "A") {
              openPrompt("link");
            }
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  onClick,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // Keeps editor focus intact
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-md p-1.5 transition-colors ${
        active 
          ? "bg-primary/10 text-primary hover:bg-primary/20" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
    </button>
  );
}