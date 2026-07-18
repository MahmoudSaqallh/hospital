import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Baby,
  Bone,
  Brain,
  Droplets,
  Ear,
  Eye,
  Hand,
  Heart,
  HeartPulse,
  MapPin,
  ScanLine,
  Scissors,
  Smile,
  Stethoscope,
  UserRound,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { clinicAvailabilityHint } from "@/lib/clinic";
import type { DoctorModel } from "@/lib/clinic";
import StatusBadge from "@/app/components/ui/StatusBadge";

type Props = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  color: string;
  doctors: DoctorModel[];
  branch?: string;
  floor?: string;
};

// Map the JSON icon names to lucide-react icons (they render reliably,
// unlike the previously referenced Material Symbols font).
const ICONS: Record<string, LucideIcon> = {
  lungs: Wind,
  heart: Heart,
  bone: Bone,
  scan: ScanLine,
  stomach: Activity,
  brain: Brain,
  eye: Eye,
  ear: Ear,
  skin: Hand,
  child: Baby,
  surgery: Scissors,
  female: HeartPulse,
  urology: Droplets,
  braces: Smile,
  tooth: Smile,
};

export default function ClinicCard({
  id,
  title,
  desc,
  icon,
  color,
  doctors,
  branch = "الفرع الرئيسي",
  floor,
}: Props) {
  const availability = clinicAvailabilityHint(doctors);
  const Icon = ICONS[icon] ?? Stethoscope;
  const isAvailable = availability.includes("متاح");
  const locationLabel = floor ? `الطابق ${floor}` : branch;

  return (
    <div className="group card card-hover relative flex h-full flex-col overflow-hidden p-5 sm:p-6">
      {/* soft accent glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{ backgroundColor: color + "26", color }}
        >
          <Icon size={28} strokeWidth={2} />
        </div>
        <StatusBadge
          state={isAvailable ? "available" : "closed"}
          text={availability}
        />
      </div>

      <h3 className="mt-4 text-lg font-bold text-ink transition-colors group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-2">{desc}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted">
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-primary/5 px-3 py-2">
          <UserRound size={14} className="text-primary" />
          <span className="font-semibold text-ink">{doctors.length}</span>
          <span>طبيب</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-primary/5 px-3 py-2">
          <MapPin size={14} className="text-primary" />
          <span className="truncate font-semibold text-ink">{locationLabel}</span>
        </div>
      </div>

      <Link
        href={`/schedule/${id}`}
        className="group/btn mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-accent/30 px-4 py-2.5 font-semibold text-accent transition-all duration-300 hover:border-transparent hover:bg-gradient-to-l hover:from-accent hover:to-accent-dark hover:text-white focus-ring"
      >
        عرض الجدول
        <ArrowLeft size={16} className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
      </Link>
    </div>
  );
}
