type FilterChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

export default function FilterChip({ active, label, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 focus-ring ${
        active
          ? "gradient-primary text-white shadow-[0_10px_25px_-10px_rgba(8,145,178,0.7)]"
          : "border border-line bg-white text-muted hover:border-primary/40 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}
