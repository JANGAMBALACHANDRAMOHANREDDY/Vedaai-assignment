import { clsx } from "clsx";

export function Card({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-surface-border bg-white shadow-card",
        padding && "p-6 md:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
