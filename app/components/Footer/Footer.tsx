import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  Send,
  Globe,
  MessageCircle,
  AtSign,
  ChevronLeft,
} from "lucide-react";
import Logo from "../../../public/image/شعار png.png";

const quickLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "العيادات", href: "/clinics" },
  { name: "عن الجمعية", href: "/about" },
  { name: "تواصل معنا", href: "/contact" },
];

const clinics = [
  { name: "القلب والأوعية الدموية", href: "/schedule/2" },
  { name: "العظام والكسور", href: "/schedule/3" },
  { name: "الصدرية", href: "/schedule/1" },
  { name: "الجهاز الهضمي", href: "/schedule/5" },
];

const socials = [
  { name: "الموقع", href: "#", Icon: Globe },
  { name: "واتساب", href: "#", Icon: MessageCircle },
  { name: "البريد", href: "#", Icon: AtSign },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#212121] text-gray-300">
      <div className="px-[8%] sm:px-[10%] lg:px-[15%] py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full bg-white p-1 shrink-0">
                <Image
                  src={Logo}
                  alt="شعار جمعية الخدمة العامة"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
              </div>
              <h2 className="text-white font-bold text-lg leading-tight">
                جمعية الخدمة العامة
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              نقدم خدمات طبية متكاملة برؤية إنسانية، مجهزين بأحدث التقنيات الطبية
              وكادر من الاستشاريين المتخصصين لضمان أفضل رعاية صحية لكم ولعائلاتكم.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#D32F2F] hover:scale-110 transition"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav className="space-y-4" aria-label="روابط سريعة">
            <h3 className="text-white font-semibold text-base relative pb-2 after:absolute after:bottom-0 after:right-0 after:w-10 after:h-[3px] after:bg-[#D32F2F] after:rounded-full">
              روابط سريعة
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition"
                  >
                    <ChevronLeft
                      size={16}
                      className="text-[#D32F2F] transition group-hover:-translate-x-1"
                    />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Clinics */}
          <nav className="space-y-4" aria-label="عياداتنا">
            <h3 className="text-white font-semibold text-base relative pb-2 after:absolute after:bottom-0 after:right-0 after:w-10 after:h-[3px] after:bg-[#D32F2F] after:rounded-full">
              عياداتنا
            </h3>
            <ul className="space-y-3 text-sm">
              {clinics.map((clinic) => (
                <li key={clinic.href}>
                  <Link
                    href={clinic.href}
                    className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition"
                  >
                    <ChevronLeft
                      size={16}
                      className="text-[#D32F2F] transition group-hover:-translate-x-1"
                    />
                    <span>{clinic.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base relative pb-2 after:absolute after:bottom-0 after:right-0 after:w-10 after:h-[3px] after:bg-[#D32F2F] after:rounded-full">
              تواصل معنا
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D32F2F] shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  المبنى الرئيسي، شارع الجمعية، المدينة الطبية
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#D32F2F] shrink-0" />
                <a
                  href="tel:+9660000000"
                  dir="ltr"
                  className="text-gray-400 hover:text-white transition"
                >
                  +966 000 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#D32F2F] shrink-0" />
                <a
                  href="mailto:info@example.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  info@example.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-[#D32F2F] shrink-0" />
                <span className="text-gray-400">متاح 24/7 للحالات الطارئة</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="flex items-stretch gap-2 pt-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                aria-label="بريدك الإلكتروني"
                className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#D32F2F]"
              />
              <button
                type="button"
                aria-label="اشتراك"
                className="flex items-center justify-center rounded-xl bg-[#D32F2F] px-3 py-2 text-white hover:opacity-90 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="px-[8%] sm:px-[10%] lg:px-[15%] py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>
            © {year} جمعية الخدمة العامة. جميع الحقوق محفوظة.
          </p>
          <p className="flex items-center gap-1">
            <span>صُنع بكل</span>
            <Heart size={14} className="text-[#D32F2F] fill-[#D32F2F]" />
            <span>لخدمة المجتمع</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
