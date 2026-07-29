import React from "react";
import { Users, Check } from "lucide-react";

export const TARGET_GROUPS = [
  { id: "all", label: "Alla målgrupper" },
  { id: "family", label: "Barn & Familj" },
  { id: "youth", label: "Ungdom (12–17 år)" },
  { id: "young_adults", label: "Unga Vuxna (18–35 år)" },
  { id: "women", label: "Kvinnor" },
  { id: "men", label: "Män" }
];

interface TargetGroupsSectionProps {
  targetGroups: string[];
  toggleTargetGroup: (id: string) => void;
}

export function TargetGroupsSection({ targetGroups, toggleTargetGroup }: TargetGroupsSectionProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-brand-ink/5">
        <Users size={18} className="text-brand-accent shrink-0" />
        <h3 className="font-sans font-medium text-base text-brand-ink">
          2. Inbjudningar du vill se
        </h3>
      </div>
      <p className="text-brand-ink/70 text-xs font-light leading-relaxed">
        Välj vilka målgrupper du vill ta emot inbjudningar för.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {TARGET_GROUPS.map(group => {
          const isSelected = targetGroups.includes(group.id);
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => toggleTargetGroup(group.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "border-brand-accent bg-brand-paper text-brand-ink"
                  : "border-brand-ink/10 bg-brand-bg hover:border-brand-accent/30 text-brand-ink/70"
              }`}
            >
              <span>{group.label}</span>
              {isSelected && <Check size={14} className="text-brand-accent shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
