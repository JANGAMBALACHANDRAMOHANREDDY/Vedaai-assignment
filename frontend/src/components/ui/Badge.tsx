import { clsx } from "clsx";
import type { Difficulty } from "@/types/examPaper";

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  hard: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function Badge({
  children,
  variant = "default",
  difficulty,
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  difficulty?: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        difficulty && difficultyStyles[difficulty],
        !difficulty &&
          (variant === "outline"
            ? "bg-white text-slate-600 ring-slate-200"
            : "bg-brand-50 text-brand-700 ring-brand-600/20"),
        className
      )}
    >
      {children}
    </span>
  );
}
