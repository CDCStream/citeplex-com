import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.02em]">
          Page not found
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background transition-all hover:opacity-80"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
