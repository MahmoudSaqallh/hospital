type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  align?: "start" | "center";
};

export default function SectionHeader({ title, subtitle, align = "start" }: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${align === "center" ? "text-center" : ""}`}>
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-6 w-1.5 rounded-full gradient-primary" />
        <h2 className="text-2xl font-bold text-ink">{title}</h2>
      </div>
      {subtitle ? (
        <p className={`mt-2 text-sm text-muted ${align === "center" ? "mx-auto max-w-2xl" : ""}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
