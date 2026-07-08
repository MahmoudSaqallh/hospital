"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { clinics } from "@/lib/data";
import ClinicCard from "@/app/components/ClinicCard";
import type { CardFilter } from "@/lib/clinic";
import { filterClinics } from "@/lib/clinic";
import EmptyState from "@/app/components/ui/EmptyState";
import { StaggerGroup, StaggerItem } from "@/app/components/motion/Stagger";

export default function ClinicsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CardFilter>("all");
  const [sortBy, setSortBy] = useState<"relevant" | "available" | "alphabetical">("relevant");

  const filtered = useMemo(() => {
    const base = filterClinics(clinics, filter, search);
    if (sortBy === "alphabetical") {
      return [...base].sort((a, b) => a.title.localeCompare(b.title, "ar"));
    }
    if (sortBy === "available") {
      return [...base].sort((a, b) => b.doctors.length - a.doctors.length);
    }
    return base;
  }, [filter, search, sortBy]);

  return (
    <section className="container-custom py-8 sm:py-12">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl gradient-primary p-6 text-white shadow-[0_20px_45px_-20px_rgba(14,116,144,0.6)] sm:p-8">
        <div aria-hidden className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-white">دليل العيادات</h1>
            <p className="mt-2 max-w-lg text-sm text-white/85">
              استعرض جميع التخصصات والأطباء المتاحين للحجز، وابحث عن العيادة المناسبة لحالتك.
            </p>
          </div>
          <Link
            href="/booking"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5"
          >
            بدء الحجز
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-3 rounded-2xl border border-line bg-white/85 p-4 shadow-sm backdrop-blur sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث باسم العيادة"
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as CardFilter)}
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">كل التصنيفات</option>
          <option value="باطنية">باطنية</option>
          <option value="جراحة">جراحة</option>
          <option value="تشخيص">تشخيص</option>
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as "relevant" | "available" | "alphabetical")}
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="relevant">الأكثر صلة</option>
          <option value="available">الأكثر توفرا</option>
          <option value="alphabetical">ترتيب أبجدي</option>
        </select>
      </div>

      <StaggerGroup
        key={`${filter}-${sortBy}`}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((clinic) => (
          <StaggerItem key={clinic.id} className="h-full">
            <ClinicCard
              id={clinic.id}
              title={clinic.title}
              desc={clinic.desc}
              icon={clinic.icon}
              color={clinic.color}
              doctors={clinic.doctors}
              branch={clinic.branch}
            />
          </StaggerItem>
        ))}
      </StaggerGroup>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="لا توجد عيادات مطابقة"
            description="جرّب تصنيفا آخر أو امسح عبارة البحث."
          />
        </div>
      ) : null}
    </section>
  );
}
