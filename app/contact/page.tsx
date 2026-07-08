"use client";

import { useState } from "react";
import {
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Send,
} from "lucide-react";

const BOOKING_CONTACT = {
  title: "للحجز والاستفسار",
  description: "تواصل معنا لحجز موعد أو طرح أي استفسار طبي.",
  phones: [
    { display: "0597706883", href: "tel:+972597712885" },
    { display: "0597715288", href: "tel:+972597715288" },
  ],
  email: { display: "info@pah.ps", href: "mailto:info@pah.ps" },
  whatsapp: {
    display: "00970597715288",
    href: "https://wa.me/972597712885",
  },
} as const;

const PROJECTS_CONTACT = {
  title: "المشاريع",
  description: "للاستفسار عن المشاريع والشراكات والتعاون المؤسسي.",
  phones: [{ display: "00970597715288", href: "tel:+972597706883" }],
  email: { display: "project@pah.ps", href: "mailto:project@pah.ps" },
  
} as const;

type ContactState = "idle" | "success";
type SectionAccent = "primary" | "accent";

function ContactInfoSection({
  title,
  description,
  phones,
  email,
  whatsapp,
  accent,
  icon: Icon,
}: {
  title: string;
  description: string;
  phones: readonly { display: string; href: string }[];
  email: { display: string; href: string };
  whatsapp?: { display: string; href: string };
  accent: SectionAccent;
  icon: typeof CalendarCheck;
}) {
  const isPrimary = accent === "primary";
  const borderClass = isPrimary ? "border-primary" : "border-accent";
  const topBarClass = isPrimary ? "gradient-primary" : "bg-accent";
  const bgClass = isPrimary
    ? "from-primary/10 via-white to-primary/5 shadow-primary/10 hover:shadow-primary/20"
    : "from-accent/10 via-white to-accent/5 shadow-accent/10 hover:shadow-accent/20";
  const labelClass = isPrimary ? "text-primary" : "text-accent";
  const iconWrapClass = isPrimary ? "gradient-primary" : "bg-accent";

  return (
    <section className={`card relative overflow-hidden border-2 ${borderClass} p-6 sm:p-8`}>
      <div className={`absolute inset-x-0 top-0 h-1.5 ${topBarClass}`} />

      <div className="flex items-start gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${iconWrapClass}`}
        >
          <Icon size={24} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </div>

      <div className={`mt-6 grid gap-4 ${phones.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {phones.map((phone) => (
          <a
            key={phone.display}
            href={phone.href}
            dir="ltr"
            className={`group relative overflow-hidden rounded-2xl border-2 ${borderClass} bg-gradient-to-br ${bgClass} p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition group-hover:scale-110 ${iconWrapClass}`}
              >
                <PhoneCall size={22} />
              </span>
              <span className="text-right">
                
                <span className="mt-1 block text-lg font-bold tracking-wide text-ink sm:text-xl">
                  {phone.display}
                </span>
                <span className="mt-1 block text-xs text-muted">اضغط للاتصال مباشرة</span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className={`mt-4 grid gap-4 ${whatsapp ? "sm:grid-cols-2" : ""}`}>
        <a
          href={email.href}
          dir="ltr"
          className={`group flex items-center gap-4 rounded-2xl border-2 ${borderClass} bg-gradient-to-br ${bgClass} p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}
        >
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition group-hover:scale-110 ${iconWrapClass}`}
          >
            <Mail size={22} />
          </span>
          <span className="text-right">
         
            <span className="mt-1 block text-lg font-bold text-ink sm:text-xl">{email.display}</span>
            <span className="mt-1 block text-xs text-muted">اضغط لإرسال بريد</span>
          </span>
        </a>

        {whatsapp ? (
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noreferrer"
            dir="ltr"
            className="group flex items-center gap-4 rounded-2xl border-2 border-[#25d366] bg-gradient-to-br from-[#25d366]/10 via-white to-[#25d366]/5 p-5 shadow-lg shadow-[#25d366]/10 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#25d366]/20"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-whatsapp text-white shadow-md transition group-hover:scale-110">
              <MessageCircle size={22} />
            </span>
            <span className="text-right">
          
              <span className="mt-1 block text-lg font-bold text-ink sm:text-xl">{whatsapp.display}</span>
              <span className="mt-1 block text-xs text-muted">اضغط لفتح المحادثة</span>
            </span>
          </a>
        ) : null}
      </div>
    </section>
  );
}

export default function ContactPage() {
  const [status, setStatus] = useState<ContactState>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      <div className="blob animate-float-slow -right-24 -top-24 h-72 w-72 bg-primary-lighter/40" />
      <div className="blob -left-20 top-40 h-64 w-64 bg-accent/20" />

      <div className="container-custom relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <MessageCircle size={26} />
            تواصل معنا
          </span>
          <h1 className="mt-4 text-ink">
            نحن هنا <span className="text-gradient">لمساعدتك</span>
          </h1>
          <p className="mt-3 text-muted">اختر القسم المناسب للتواصل معنا مباشرة.</p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-8">
          <ContactInfoSection
            title={BOOKING_CONTACT.title}
            description={BOOKING_CONTACT.description}
            phones={BOOKING_CONTACT.phones}
            email={BOOKING_CONTACT.email}
            whatsapp={BOOKING_CONTACT.whatsapp}
            accent="primary"
            icon={CalendarCheck}
          />

          <ContactInfoSection
            title={PROJECTS_CONTACT.title}
            description={PROJECTS_CONTACT.description}
            phones={PROJECTS_CONTACT.phones}
            email={PROJECTS_CONTACT.email}
            accent="accent"
            icon={Briefcase}
          />

          <form
            className="card relative overflow-hidden p-6 sm:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              if (name.trim().length < 3) {
                setError("الاسم يجب أن يكون 3 أحرف على الأقل.");
                return;
              }
              if (phone.trim().length < 8) {
                setError("رقم الجوال غير مكتمل.");
                return;
              }
              if (message.trim().length < 10) {
                setError("الشكوى قصيرة جدا. أضف تفاصيل أكثر.");
                return;
              }
              setError("");
              setStatus("success");
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 gradient-primary" />
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageCircle size={20} />
              </span>
              <div>
                <h2 className="text-ink">صندوق الشكاوى</h2>
                <p className="text-sm text-muted">اكتب شكواك وسنعمل على معالجتها في أقرب وقت.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                الاسم
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="اكتب اسمك الكامل"
                  className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-sm font-semibold text-ink">
             
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="05xxxxxxxx"
                  className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-right text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
            <label className="mt-4 block text-sm font-semibold text-ink">
              نص الشكوى
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="اشرح لنا التفاصيل..."
                className="mt-1.5 w-full resize-none rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
              <Send size={16} />
              إرسال الشكوى
            </button>

            {status === "success" ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={16} />
                تم استلام شكواك بنجاح.
              </p>
            ) : null}
            {error ? (
              <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
            ) : null}
          </form>

          <div className="card overflow-hidden p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-ink">
                <MapPin size={20} className="text-primary" />
                الموقع
              </h2>
             
            </div>
            <p className="mt-3 text-sm text-muted">المبنى الرئيسي: غزة شارع عمر المختار - خلف محطة الحجاز</p>
            <p className="mt-3 text-sm text-muted">مبنى القلب: غزة- شمال ترخيص السامر - بجوار مسجد الاسي</p>
            <div className="mt-4 flex h-40 items-center justify-center rounded-2xl border border-dashed border-line bg-primary/5 p-4 text-center text-xs text-muted">
              خريطة تفاعلية ستضاف هنا (Google Maps/Mapbox) مع إحداثيات الفروع.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
