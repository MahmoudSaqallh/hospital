"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Logo from "../../../public/image/لوجو الصفحة.png";
import { Menu, Phone, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "العيادات", href: "/clinics" },
    { name: "الحجز", href: "/booking" },
    { name: "بوابة المريض", href: "/patient" },
    { name: "عن الجمعية", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(15,34,51,0.15)] border-b border-white/60"
          : "bg-white/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container-custom">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 sm:py-2.5 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0 group">
            <div className="relative shrink-0 ">
              <Image src={Logo} alt="logo" width={70} height={70} className=" object-contain" />
            </div>
            <h3 className="hidden lg:block text-[#000000] bg-clip-text bg-gradient-to-l from-primary to-primary-light font-bold text-2xl leading-tight">
              جمعية الخدمة العامة
              <br />
              ومجموعة مستشفياتها
            </h3>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-xl px-3.5 py-2 text-base font-medium transition-colors ${
                    active ? "text-primary" : "text-ink/70 hover:text-primary"
                  }`}
                >
                  {link.name}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full gradient-primary"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/contact"
           className="hidden lg:flex btn-primary text-base px-4 py-2.5 shrink-0 btn-d"
          >
            <Phone size={16} />
            تواصل معنا
          </Link>

          {/* Mobile Icon */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            className="lg:hidden text-ink p-3 shrink-0 rounded-xl hover:bg-primary/10 transition focus-ring"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open ? (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pb-4 space-y-1.5 pt-2">
                {navLinks.map((link, index) => {
                  const active = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * index, duration: 0.25 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded-xl px-4 py-3 text-lg transition focus-ring ${
                          active
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-ink hover:text-primary hover:bg-primary/5"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-2 w-full py-3"
                >
                  <Phone size={16} />
                  تواصل معنا
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
