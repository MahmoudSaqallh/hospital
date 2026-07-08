"use client";

import ClinicCard from "../../../components/ClinicCard";
import { useState } from "react";
import { Search } from "lucide-react";
import { clinics } from "@/lib/data";
import { filterClinics, type CardFilter } from "@/lib/clinic";
import EmptyState from "@/app/components/ui/EmptyState";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import FilterChip from "@/app/components/ui/FilterChip";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { StaggerGroup, StaggerItem } from "@/app/components/motion/Stagger";

export default function Cards() {
  const [filter, setFilter] = useState<CardFilter>("all");
  const [search, setSearch] = useState("");

  const buttons: { id: CardFilter; label: string }[] = [
    { id: "all", label: "الكل" },
    { id: "باطنية", label: "باطنية" },
    { id: "جراحة", label: "جراحة" },
    { id: "تشخيص", label: "تشخيص" },
  ];

  const filtered = filterClinics(clinics, filter, search);

  return (
    <section className="py-10 sm:py-14">
      <div className="container-custom">
        {/* Sticky search / filter bar */}
 

        <SectionHeader
          title=" العيادات التخصصية"
          subtitle="اختر العيادة التخصصية ثم استعرض جدول الأطباء المتاحين."
        />


               <div className="sticky top-[86px] z-30 mb-8">
          <div className="mx-auto w-full rounded-2xl border border-line bg-white/85 p-3 shadow-[0_10px_30px_-15px_rgba(15,34,51,0.2)] backdrop-blur-xl sm:p-4 lg:w-[92%]">
            <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-[42%]">
                <label htmlFor="clinic-search" className="mb-1.5 block text-sm font-semibold text-ink">
                  ابحث عن التخصص المناسب
                </label>
                <div className="relative">
                  <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    id="clinic-search"
                    type="text"
                    placeholder="اكتب اسم التخصص أو جزءا من الوصف"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={() => {
                      if (search.trim().length > 0) {
                        trackEvent({ event: "clinic_search_used", metadata: { queryLength: search.trim().length } });
                      }
                    }}
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 md:justify-end">
                {buttons.map((btn) => (
                  <FilterChip
                    key={btn.id}
                    onClick={() => {
                      setFilter(btn.id);
                      trackEvent({ event: "clinic_filter_changed", metadata: { filter: btn.id } });
                    }}
                    active={filter === btn.id}
                    label={btn.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <StaggerGroup
          key={filter}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item) => (
            <StaggerItem key={item.id} className="h-full">
              <ClinicCard
                id={item.id}
                title={item.title}
                desc={item.desc}
                icon={item.icon}
                color={item.color}
                doctors={item.doctors}
                branch={item.branch}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="لا توجد نتائج مطابقة"
              description="جرّب تعديل كلمات البحث أو اختيار تصنيف آخر. يمكنك أيضا استعراض جميع العيادات."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="btn-primary text-sm"
                >
                  إعادة تعيين البحث
                </button>
              }
            />
            <div className="mt-4 text-center">
              <Link href="/clinics" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                عرض دليل العيادات الكامل
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
