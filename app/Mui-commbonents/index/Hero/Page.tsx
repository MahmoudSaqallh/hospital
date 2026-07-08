import { ArrowLeft, Clock, HeartPulse, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/app/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/app/components/motion/Stagger";
import Herophot from "../../../../public/image/c52ce033-3acd-4b32-a694-aa4a8916051f.jpg";
const stats = [
  { icon: Stethoscope, value: "+20", label: "تخصص طبي" },
  { icon: HeartPulse, value: "عمليات جراحية", label: "غرف عمليات مجهزة" },
  { icon: ShieldCheck, value: "100%", label: "خصوصية وأمان" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden gradient-primary-soft">
      {/* Background image + overlay */}
      <Image
        src={Herophot}
        alt="خلفية طبية"
        fill
        priority
        className="object-cover object-center "
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-canvas" />

      {/* Decorative blobs */}
      <div aria-hidden className="blob animate-float-slow" style={{ top: "-4rem", left: "10%", width: "22rem", height: "22rem", background: "rgba(8,145,178,0.25)" }} />
      <div aria-hidden className="blob" style={{ bottom: "-6rem", right: "5%", width: "24rem", height: "24rem", background: "rgba(225,29,72,0.12)" }} />

      <div className="container-custom relative py-16 text-center sm:py-24 lg:py-28">


        <Reveal delay={0.08}>
          <h1 className="mx-auto mt-6 max-w-4xl text-red-700">
    جمعية الخدمة العامة و مجموعة مستشفياتها<br className="hidden sm:block" />
            <span className="text-gradient text-4xl">رعاية صحية متكاملة برؤية إنسانية في مكان واحد</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-black sm:text-lg">
            مجهزون بأحدث التقنيات الطبية وكادر من الاستشاريين المتخصصين لضمان أفضل
            رعاية صحية لكم ولعائلاتكم في كل الأوقات.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 px-2 sm:flex-row sm:items-center">
            <Link href="/contact" className="btn-primary group">
              تواصل معنا
              <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
            <Link href="/clinics" className="btn-outline bg-white/60 backdrop-blur">
              استعرض العيادات
            </Link>

          </div>
        </Reveal>

        {/* Stats */}
        <StaggerGroup className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <div className="card card-hover flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-primary text-white shadow-sm">
                    <Icon size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-ink">{stat.value}</div>
                    <div className="text-sm text-muted">{stat.label}</div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
