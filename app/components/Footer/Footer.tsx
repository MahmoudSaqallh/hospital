import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/image/لوجو الصفحة.png";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
const quickLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "العيادات", href: "/clinics" },
  { name: "الحجز", href: "/booking" },
  { name: "بوابة المريض", href: "/patient" },
  { name: "عن الجمعية", href: "/about" },
  { name: "تواصل معنا", href: "/contact" },
  { name: "الخصوصية", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="relative z-0 mt-auto overflow-hidden bg-[#000000d1]  text-white">
      {/* subtle gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(60% 120% at 85% 0%, rgba(34,184,207,0.35), transparent 60%)" }}
      />

      <div className="container-custom relative py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
            <div className="flex items-center gap-2">
              <div className="rounded-2xl backdrop-blur">
                <Image src={Logo} alt="شعار جمعية الخدمة العامة" width={150} height={150} className=" object-contain" />
              </div>
              <h3 className="text-base font-bold leading-snug sm:text-lg">
                جمعية الخدمة العامة
                <br />
                ومجموعة مستشفياتها
              </h3>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              نقدم خدمات طبية متكاملة برؤية إنسانية لضمان أفضل رعاية صحية لكم ولعائلاتكم.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-right">
            <h4 className="mb-4 font-bold text-white">روابط سريعة</h4>
            <ul className="grid grid-cols-2 gap-2 sm:block sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-primary-lighter"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary-light transition-all group-hover:w-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-right">
            <h4 className="mb-4 font-bold text-white">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center gap-2 text-sm text-white/70 sm:justify-start">
                <Phone size={16} className="shrink-0 text-primary-lighter" />
                <a className="transition-colors hover:text-white" href="tel:+966123456789" dir="ltr">+972-597 715 288</a>
              </li>
              <li className="flex items-center justify-center gap-2 text-sm text-white/70 sm:justify-start">
                <Mail size={16} className="shrink-0 text-primary-lighter" />
                <a className="transition-colors hover:text-white" href="mailto:info@gsp-hospitals.org">info@pah.ps</a>
              </li>
              <li className="flex items-center justify-center gap-2 text-sm text-white/70 sm:justify-start">
                <MapPin size={16} className="shrink-0 text-primary-lighter" />
                <span>المبنى الرئيسي: شارع عمر المختار- خلف محطة الحجاز
                  
                </span>
              </li>
              <li className="flex items-center justify-center gap-2 text-sm text-white/70 sm:justify-start">
                <MapPin size={16} className="shrink-0 text-primary-lighter" />
                <span>مبنى القلب والأوعية الدموية: شمال ترخيص السامر - بجوار مسجد الإسي

                </span>
              </li>
              <li>
                <a
                  className="mt-1 inline-flex items-center gap-2 rounded-xl bg-whatsapp/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-whatsapp"
                  href="https://wa.me/970597715288"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp size={16} className="shrink-0" />
                  راسلنا عبر واتساب
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-custom py-4 text-center text-xs text-white/60 sm:text-sm">
          © {new Date().getFullYear()} جمعية الخدمة العامة ومجموعة مستشفياتها. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
