const STYLES = [
  { key: "apa", label: "APA 7", color: "#2563eb" },
  { key: "mla", label: "MLA 9", color: "#7c3aed" },
  { key: "chicago", label: "Chicago", color: "#dc2626" },
  { key: "bluebook", label: "Bluebook", color: "#0891b2" },
] as const;

const OUTPUT: Record<
  string,
  { ref: string; secondary: string; secondaryLabel: string }
> = {
  apa: {
    ref: `Harari, Y. N. (2015). <em>Sapiens: A brief history of humankind</em>. Harper.`,
    secondary: "(Harari, 2015, p. 23)",
    secondaryLabel: "In-text",
  },
  mla: {
    ref: `Harari, Yuval Noah. <em>Sapiens: A Brief History of Humankind</em>. Harper, 2015.`,
    secondary: "(Harari 23)",
    secondaryLabel: "In-text",
  },
  chicago: {
    ref: `Harari, Yuval Noah. <em>Sapiens: A Brief History of Humankind</em>. New York: Harper, 2015.`,
    secondary: `Yuval Noah Harari, <em>Sapiens</em> (New York: Harper, 2015), 23.`,
    secondaryLabel: "Footnote",
  },
  bluebook: {
    ref: `YUVAL NOAH HARARI, SAPIENS: A BRIEF HISTORY OF HUMANKIND 23 (2015).`,
    secondary: `Harari, <em>supra</em> note 12, at 23.`,
    secondaryLabel: "Short form",
  },
};

/** Server-rendered hero demo — CSS-only style tabs, zero client JS. */
export function LiveCitationDemoStatic() {
  return (
    <div className="cite-demo rounded-2xl border border-border bg-card shadow-2xl shadow-zinc-900/5 overflow-hidden md:animate-float">
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <span className="flex-1 text-center text-[11px] text-muted-foreground font-mono">
          citeplex.com
        </span>
        <div className="w-10" />
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 text-xs font-bold">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate">Sapiens: A Brief History of Humankind</p>
            <p className="text-[11px] text-muted-foreground">Yuval Noah Harari · 2015 · Harper</p>
          </div>
        </div>

        {STYLES.map((s, i) => (
          <input
            key={s.key}
            type="radio"
            name="cite-demo-style"
            id={`cite-demo-${s.key}`}
            defaultChecked={i === 0}
            className="cite-demo-input sr-only"
          />
        ))}

        <div className="flex gap-1 p-1 rounded-lg bg-muted/60">
          {STYLES.map((s) => (
            <label
              key={s.key}
              htmlFor={`cite-demo-${s.key}`}
              className={`cite-demo-tab cite-demo-tab-${s.key} flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </label>
          ))}
        </div>

        {STYLES.map((s) => {
          const out = OUTPUT[s.key];
          return (
            <div key={s.key} className={`cite-demo-panel cite-demo-panel-${s.key} space-y-4`}>
              <div className="rounded-xl bg-muted/40 border border-border/60 overflow-hidden">
                <div className="px-4 py-2 border-b border-border/60">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Reference
                  </span>
                </div>
                <div className="px-4 py-3">
                  <p
                    className="text-[13px] leading-relaxed pl-4 -indent-4 citation-text"
                    dangerouslySetInnerHTML={{ __html: out.ref }}
                  />
                </div>
              </div>
              <div className="rounded-xl bg-muted/40 border border-border/60 overflow-hidden">
                <div className="px-4 py-2 border-b border-border/60">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    {out.secondaryLabel}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <p
                    className="text-[13px] text-muted-foreground citation-text"
                    dangerouslySetInnerHTML={{ __html: out.secondary }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
