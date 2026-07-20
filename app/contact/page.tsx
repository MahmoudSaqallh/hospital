"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  PhoneCall,
  Send,
} from "lucide-react";
import { apiForm, ApiError } from "@/lib/api";
import { useToast } from "@/app/components/ToastProvider";
import {
  digitsOnly,
  validatePatientPhone,
} from "@/lib/patientValidation";

const BOOKING_CONTACT = {
  title: "للحجز والاستفسار",
  description: "تواصل معنا لحجز موعد أو طرح أي استفسار طبي.",
  phones: [
    { display: "0597706883", href: "tel:0597706883" },
    { display: "0597715288", href: "tel:0597715288" },
  ],
  email: { display: "info@pah.ps", href: "mailto:info@pah.ps" },
  whatsapp: {
    display: "00970597715288",
    href: "https://wa.me/970597715288",
  },
} as const;

const PROJECTS_CONTACT = {
  title: "المشاريع",
  description: "للاستفسار عن المشاريع والشراكات والتعاون المؤسسي.",
  phones: [{ display: "0597706883", href: "tel:+972597706883" }],
  email: { display: "project@pah.ps", href: "mailto:project@pah.ps" },
} as const;

type ContactState = "idle" | "success" | "loading";
type SectionAccent = "primary" | "accent";

type ContactTile = {
  key: string;
  href: string;
  label: string;
  display: string;
  icon: typeof PhoneCall;
  external?: boolean;
  dir?: "ltr" | "rtl";
};

function ContactTileCard({
  tile,
  borderClass,
  bgClass,
  iconWrapClass,
}: {
  tile: ContactTile;
  borderClass: string;
  bgClass: string;
  iconWrapClass: string;
}) {
  const Icon = tile.icon;
  return (
    <a
      href={tile.href}
      target={tile.external ? "_blank" : undefined}
      rel={tile.external ? "noreferrer" : undefined}
      dir={tile.dir}
      className={`group relative flex min-h-[4.5rem] flex-row items-center gap-4 overflow-hidden rounded-2xl border-2 ${borderClass} bg-gradient-to-br ${bgClass} p-4 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:p-5`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${iconWrapClass}`}
      >
        <Icon size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted">{tile.label}</p>
        <p className="mt-0.5 break-all text-lg font-bold tracking-wide text-ink sm:text-xl">
          {tile.display}
        </p>
      </div>
    </a>
  );
}

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
  // الحجز والاستفسار: أخضر العلامة | المشاريع: أحمر accent
  const borderClass = isPrimary ? "border-[#0e6c09]" : "border-accent";
  const topBarClass = isPrimary
    ? "bg-gradient-to-l from-[#022400] via-[#0e6c09] to-[#199e3f]"
    : "bg-accent";
  const bgClass = isPrimary
    ? "from-[#0e6c09]/10 via-white to-[#199e3f]/5 shadow-[#0e6c09]/10 hover:shadow-[#0e6c09]/20"
    : "from-accent/10 via-white to-accent/5 shadow-accent/10 hover:shadow-accent/20";
  const iconWrapClass = isPrimary
    ? "bg-gradient-to-br from-[#0e6c09] to-[#199e3f]"
    : "bg-accent";

  const tiles: ContactTile[] = [
    ...phones.map((phone, index) => ({
      key: `phone-${phone.display}`,
      href: phone.href,
      label: phones.length > 1 ? `هاتف ${index + 1}` : "هاتف",
      display: phone.display,
      icon: PhoneCall,
      dir: "ltr" as const,
    })),
    {
      key: "email",
      href: email.href,
      label: "البريد الإلكتروني",
      display: email.display,
      icon: Mail,
      dir: "ltr" as const,
    },
  ];

  if (whatsapp) {
    tiles.push({
      key: "whatsapp",
      href: whatsapp.href,
      label: "واتساب",
      display: whatsapp.display,
      icon: MessageCircle,
      external: true,
      dir: "ltr",
    });
  }

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
      <div className="mt-6 grid grid-cols-1 gap-3">
        {tiles.map((tile) => (
          <ContactTileCard
            key={tile.key}
            tile={tile}
            borderClass={borderClass}
            bgClass={bgClass}
            iconWrapClass={iconWrapClass}
          />
        ))}
      </div>
    </section>
  );
}

export default function ContactPage() {
  const { data: session, status: authStatus } = useSession();
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState<ContactState>("idle");
  const [error, setError] = useState("");

  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
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
            onSubmit={async (event) => {
              event.preventDefault();
              if (name.trim().length < 3) {
                setError("الاسم يجب أن يكون 3 أحرف على الأقل.");
                return;
              }
              const phoneCheck = validatePatientPhone(phone);
              if (!phoneCheck.ok) {
                setError(phoneCheck.error);
                return;
              }
              if (message.trim().length < 10) {
                setError("الشكوى قصيرة جدا. أضف تفاصيل أكثر.");
                return;
              }
              if (attachment) {
                const okType =
                  attachment.type.startsWith("image/") ||
                  attachment.type === "application/pdf";
                if (!okType) {
                  setError("المرفق يجب أن يكون صورة أو ملف PDF.");
                  return;
                }
                if (attachment.size > 8 * 1024 * 1024) {
                  setError("حجم المرفق كبير جداً (الحد 8 ميجا).");
                  return;
                }
              }
              if (authStatus !== "authenticated" || !session?.accessToken) {
                setError("يجب تسجيل الدخول لإرسال الشكوى عبر النظام.");
                return;
              }
              setError("");
              setStatus("loading");
              try {
                const formData = new FormData();
                formData.append("subject", `شكوى من ${name.trim()}`);
                formData.append(
                  "message",
                  `${message.trim()}\n\nالجوال: ${phoneCheck.value}`,
                );
                if (attachment) {
                  formData.append("attachment", attachment);
                }
                await apiForm("/complaints", formData, {
                  token: session.accessToken,
                });
                setStatus("success");
                setMessage("");
                setAttachment(null);
                toast.success("تم إرسال شكواك بنجاح. سيتم متابعتها قريباً.");
              } catch (err) {
                setStatus("idle");
                setError(err instanceof ApiError ? err.message : "تعذر إرسال الشكوى.");
              }
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 gradient-primary" />
            <h2 className="text-ink">صندوق الشكاوى</h2>
            {authStatus !== "authenticated" ? (
              <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                <Link href="/login?callbackUrl=/contact" className="font-bold underline">
                  سجّل دخولك
                </Link>{" "}
                أولاً لإرسال الشكوى للنظام.
              </p>
            ) : null}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                الاسم
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                الجوال
                <input
                  value={phone}
                  onChange={(e) => setPhone(digitsOnly(e.target.value, 10))}
                  required
                  dir="ltr"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="0(59|56)[0-9]{7}"
                  placeholder="059xxxxxxx"
                  autoComplete="tel"
                  className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-right text-sm outline-none"
                />
                <p className="mt-1 text-xs text-muted">10 أرقام ويبدأ بـ 059 أو 056</p>
              </label>
            </div>
            <label className="mt-4 block text-sm font-semibold text-ink">
              نص الشكوى
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="mt-1.5 w-full resize-none rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-ink">
              مرفق (صورة أو PDF)
              <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-dashed border-line bg-canvas px-4 py-3">
                <Paperclip size={18} className="shrink-0 text-primary" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.pdf"
                  onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-muted file:me-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary"
                />
              </div>
              {attachment ? (
                <p className="mt-1.5 text-xs text-muted">{attachment.name}</p>
              ) : (
                <p className="mt-1.5 text-xs text-muted">اختياري — حتى 8 ميجا</p>
              )}
            </label>
            <button type="submit" className="btn-primary mt-6" disabled={status === "loading"}>
              <Send size={16} />
              {status === "loading" ? "جاري الإرسال..." : "إرسال الشكوى"}
            </button>
            {status === "success" ? (
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={16} />
                تم استلام شكواك بنجاح.
              </p>
            ) : null}
            {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
          </form>

          <div className="card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-ink">
              <MapPin size={20} className="text-primary" />
              الموقع
            </h2>
            <p className="mt-3 text-sm text-muted">المبنى الرئيسي: غزة شارع عمر المختار</p>
          </div>
        </div>
      </div>
    </section>
  );
}
