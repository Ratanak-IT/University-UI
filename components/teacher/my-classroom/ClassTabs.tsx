"use client";

type ClassTabsProps = {
  tabs: string[];
  activeTab: string;
};

export default function ClassTabs({ tabs, activeTab }: ClassTabsProps) {
  return (
    <div className="flex items-center gap-8 border-b border-slate-200 px-8">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            className={`relative py-4 text-[15px] font-medium transition-colors ${
              isActive
                ? "text-indigo-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-indigo-700" />
            )}
          </button>
        );
      })}
    </div>
  );
}