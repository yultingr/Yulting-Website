import type { SkillCategory } from "@/types";
import { getSkills } from "@/lib/db";

export function loadSkills(): SkillCategory[] {
  return getSkills();
}

export const skills: SkillCategory[] = [
  {
    id: "1",
    name: "Languages",
    skills: ["Tibetan (Fluent)", "English (Fluent)"],
  },
  {
    id: "2",
    name: "Technology",
    skills: [
      "Microsoft Word",
      "Microsoft PowerPoint",
      "Microsoft Excel",
      "Adobe InDesign",
    ],
  },
  {
    id: "3",
    name: "Translation",
    skills: [
      "English-Tibetan Translation",
      "Educational Contexts",
      "Scientific Contexts",
    ],
  },
];
