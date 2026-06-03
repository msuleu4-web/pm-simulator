export function Tooltip({ label, description }: { label: string; description: string }) {
  return (
    <span className="group relative inline-flex cursor-help items-center text-slate-500">
      <span className="text-sm font-medium">{label}</span>
      <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">?</span>
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-700 shadow-soft group-hover:block">
        {description}
      </span>
    </span>
  );
}
