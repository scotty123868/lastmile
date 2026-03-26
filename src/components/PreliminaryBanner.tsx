export default function PreliminaryBanner() {
  return (
    <div className="mb-4 px-3 py-1.5 rounded-md bg-amber-muted border border-amber/20 inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-amber/60" />
      <span className="text-[11px] font-medium text-amber tracking-wide">
        Preliminary Estimate — Based on Industry Benchmarks
      </span>
    </div>
  );
}
