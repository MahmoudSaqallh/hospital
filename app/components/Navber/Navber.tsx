"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../../public/image/شعار png.png";

import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "الرئيسية", href: "/" },
    { name: "العيادات", href: "/clinics" },
    { name: "عن الجمعية", href: "/about" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
  <header className="w-full bg-white border-b border-[#F0F0F0] shadow-[0_4px_20px_rgba(211,47,47,0.08)]">

      <div className="px-[10%] lg:px-[15%]">

        {/* Top Bar */}
        <div className="flex items-center justify-between py-3">

          {/* Logo */}
          <div className="flex items-center">
            <Image src={Logo} alt="logo" width={90} height={90} />

            <h1 className="text-[#D32F2F] font-bold text-lg hidden sm:block">
              جمعية الخدمة العامة
            </h1>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm">

            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`pb-1 border-b-2 transition ${
                    active
                      ? "text-[#D32F2F] border-[#D32F2F]"
                      : "text-[#212121] border-transparent hover:text-[#D32F2F]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

          </nav>

          {/* Button Desktop */}
          <button className="hidden md:block bg-[#D32F2F] text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
            حجز موعد
          </button>

          {/* Mobile Icon */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#212121]"
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>

        {/* MOBILE MENU (Animated) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
          `}
        >
          <div className="pb-4 space-y-3 pt-2">

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-[#212121] hover:text-[#D32F2F] transition"
              >
                {link.name}
              </Link>
            ))}

            <button className="w-full bg-[#D32F2F] text-white py-3 rounded-xl">
              حجز موعد
            </button>

          </div>
        </div>

      </div>

    </header>
  );
}