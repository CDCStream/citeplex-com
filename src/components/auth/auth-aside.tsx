import { LogoMark } from "@/components/ui/logo";
import { Check } from "lucide-react";

const points = [
  "Save unlimited citations to your library",
  "Organize references into projects",
  "Export to Word, BibTeX, and clipboard",
  "APA, MLA, Chicago, Turabian, Bluebook & Harvard",
];

export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-zinc-900 text-zinc-50 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="grain absolute inset-0" />
      <div className="relative z-10 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50">
          <LogoMark className="h-6 w-6 text-zinc-900" />
        </div>
        <span className="text-[15px] font-bold tracking-tight">
          cite<span className="text-zinc-500">plex</span>
        </span>
      </div>

      <div className="relative z-10 max-w-md">
        <blockquote className="text-2xl font-medium leading-snug tracking-tight">
          &ldquo;The clean, fast citation tool I wish I had during law school.&rdquo;
        </blockquote>
        <p className="mt-4 text-[13px] text-zinc-400">
          Accurate formatting for every major style — without the ads and clutter.
        </p>

        <ul className="mt-8 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <Check className="h-2.5 w-2.5 text-amber-400" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-[12px] text-zinc-500">
        Trusted by students and researchers worldwide.
      </p>
    </aside>
  );
}
