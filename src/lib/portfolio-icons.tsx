import { Clapperboard, FileText, FolderOpen, Palette, Presentation } from "lucide-react";

export const portfolioIconOptions = [
  { value: "project_file", label: "ملفات المشاريع", icon: FolderOpen },
  { value: "video_design", label: "تصميم الفيديوهات", icon: Clapperboard },
  { value: "visual_design", label: "التصاميم البصرية", icon: Palette },
  { value: "presentation", label: "العروض التقديمية", icon: Presentation },
  { value: "other", label: "أعمال أخرى", icon: FileText },
] as const;

export type PortfolioIconType = (typeof portfolioIconOptions)[number]["value"];

export function getPortfolioIcon(type: string) {
  return portfolioIconOptions.find((option) => option.value === type) ?? portfolioIconOptions[0];
}