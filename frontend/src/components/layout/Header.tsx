import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            AC
          </span>
          <div>
            <span className="block text-sm font-semibold text-slate-900">
              Assessment Creator
            </span>
            <span className="block text-xs text-slate-500">AI-powered exam papers</span>
          </div>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <Link
            href="/assignments/new"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            New Assignment
          </Link>
        </nav>
      </div>
    </header>
  );
}
