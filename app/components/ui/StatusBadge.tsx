type StatusBadgeProps = {
  state: "available" | "leave" | "closed";
  text: string;
};

const stylesByState: Record<StatusBadgeProps["state"], string> = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  leave: "bg-rose-50 text-rose-700 ring-rose-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const dotByState: Record<StatusBadgeProps["state"], string> = {
  available: "bg-emerald-500",
  leave: "bg-rose-500",
  closed: "bg-slate-400",
};

export default function StatusBadge({ state, text }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${stylesByState[state]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotByState[state]} ${state === "available" ? "animate-pulse" : ""}`} />
      {text}
    </span>
  );
}
