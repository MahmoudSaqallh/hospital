import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, MessageCircle, Phone } from "lucide-react";
import { getClinicById } from "@/lib/data";
import StatusBadge from "@/app/components/ui/StatusBadge";
import EmptyState from "@/app/components/ui/EmptyState";
import Reveal from "@/app/components/motion/Reveal";
import DoctorPhoto from "@/app/components/DoctorPhoto";
import { parseClinicId } from "@/lib/schedule";

type SchedulePageProps = {
  params: Promise<{ id: string }>;
};

function slotBadge(value: string) {
  if (value === "إجازة") {
    return <StatusBadge state="leave" text="إجازة" />;
  }
  return <StatusBadge state="available" text="متاح" />;
}

export default async function Page({ params }: SchedulePageProps) {
  const { id } = await params;
  const numericId = parseClinicId(id);

  if (!numericId) {
    notFound();
  }

  const department = getClinicById(numericId);

  if (!department) {
    notFound();
  }

  return (
    <div className="container-custom py-8 sm:py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-6 text-white shadow-[0_20px_45px_-20px_rgba(14,116,144,0.6)] sm:p-8">
          <div aria-hidden className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

          <Link
            href="/clinics"
            className="relative inline-flex items-center gap-1 text-sm text-white/85 transition hover:text-white"
          >
            <ArrowRight size={16} />
            الرجوع إلى دليل العيادات
          </Link>

          <div className="relative mt-4 flex items-center gap-4">
            <div>
              <h1 className="text-white">{department.title}</h1>
              <p className="mt-1 text-sm text-white/85">{department.desc}</p>
              {department.branch ? (
                <p className="mt-1 text-xs text-white/75">{department.branch}</p>
              ) : null}
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-2">
            <Link
              href={`/booking?clinic=${department.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:-translate-y-0.5"
            >
              <CalendarDays size={16} />
              احجز الآن
            </Link>

            <a
              href="tel:+972597715288"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Phone size={16} />
              اتصال
            </a>

            <a
              href="https://wa.me/970597715288"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <MessageCircle size={16} />
              واتساب
            </a>
          </div>
        </div>
      </Reveal>

      {department.doctors.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="لا يوجد أطباء حاليا"
            description="هذه العيادة لا تحتوي على أطباء متاحين حاليا. تواصل معنا وسنساعدك في أقرب موعد."
            action={
              <Link href="/contact" className="btn-primary text-sm">
                تواصل معنا
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {department.doctors.map((doc, index) => (
            <Reveal key={doc.name} delay={index * 0.05}>
              <div className="card card-hover p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center gap-5 border-b border-line pb-5">
                  <DoctorPhoto name={doc.name} photo={doc.photo} size="lg" />
                  <div>
                    <h2 className="text-base font-bold text-ink sm:text-xl">{doc.name}</h2>
                    <p className="mt-1 text-sm font-medium text-primary sm:text-base">
                      استشاري قسم {department.title}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:text-sm lg:grid-cols-3">
                  {Object.entries(doc.schedule).map(([day, value]) => (
                    <div
                      key={day}
                      className="rounded-xl border border-line bg-slate-50/60 p-3 text-right transition hover:border-primary/30 hover:bg-white"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-semibold text-ink">{day}</div>
                        {slotBadge(value)}
                      </div>
                      <div className="text-xs text-muted">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
