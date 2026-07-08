import Link from "next/link";
import { Award, HeartHandshake, ShieldCheck, Stethoscope, Hospital , UsersRound } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/app/components/motion/Stagger";

const values = [
  { icon: HeartHandshake, text: "   عيادات تخصصية بكامل تجهيزاتها  " },
  { icon: UsersRound, text: "فريق طبي متخصص بخبرات في أكثر من 20 تخصصا." },
  { icon: Hospital , text: "غرف عمليات مجهزة" },
];

const credentials = [
  { icon: ShieldCheck, text: "مرخص من وزارة الصحة الفلسطينية" },
  { icon: Stethoscope, text: "متابعة دورية ومستمرة حتى الشفاء التام" },
  { icon: Award, text: "خدمات مساندة كالأشعة والمختبر والصيدلية" },
];

export default function AboutPage() {
  return (
    <section className="container-custom py-8 sm:py-12">
      <Reveal>
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            عن الجمعية
          </span>
          <h1 className="mt-4 text-ink">
            نبني <span className="text-gradient">رعاية صحية</span> تليق بك
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            جمعية الخدمة العامة ومجموعة مستشفياتها تقدم خدمات صحية تخصصية متكاملة بهدف رفع جودة حياة المرضى وتسهيل الوصول إلى الرعاية المناسبة.
          </p>
        </div>
      </Reveal>

      <StaggerGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <StaggerItem key={value.text}>
              <div className="card card-hover h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white shadow-sm">
                  <Icon size={24} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink">{value.text}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <div className="mt-12">
        <Reveal>
          <h2 className="text-ink">الاعتمادات ومؤشرات الثقة</h2>
        </Reveal>
        <StaggerGroup className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.text}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-line bg-white p-4 text-sm text-ink">
                  <Icon size={20} className="shrink-0 text-primary" />
                  {item.text}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>

      <Reveal>
        <div className="mt-12 flex flex-wrap gap-3 rounded-3xl gradient-primary-soft p-6 sm:p-8">
          <div className="flex-1">
            <h2 className="text-ink">جاهز لحجز موعدك؟</h2>
            <p className="mt-1 text-sm text-muted">تواصل معنا أو احجز موعدا في التخصص المناسب لحالتك.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/booking" className="btn-primary">احجز موعد</Link>
            <Link href="/contact" className="btn-outline bg-white">تواصل معنا</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
