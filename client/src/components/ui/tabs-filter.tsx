import { useState } from "react";
import { cn } from "@/lib/utils";

interface TabOption {
  id: string;
  label: string;
}

interface TabsFilterProps {
  options: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function TabsFilter({
  options,
  activeTab,
  onChange,
  className
}: TabsFilterProps) {
  return (
    <div className={cn("border-b border-border", className)}>
      <ul className="flex flex-wrap -mb-px">
        {options.map((option) => (
          <li key={option.id} className="mr-2">
            <a
              href="#"
              className={cn(
                "inline-block p-2 font-medium text-sm",
                activeTab === option.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                onChange(option.id);
              }}
            >
              {option.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
