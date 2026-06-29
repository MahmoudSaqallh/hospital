"use client";

import allCards from "../../../jsonData/Cards.json";
import ClinicCard from "../../../components/ClinicCard";
import { useState } from "react";
import { Search } from "lucide-react";

export default function Cards() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const buttons = [
    { id: "all", label: "الكل" },
    { id: "باطنية", label: "باطنية" },
    { id: "جراحة", label: "جراحة" },
    { id: "تشخيص", label: "تشخيص" },
  ];

  const filtered = allCards.filter((item) => {
    const matchesGroup =
      filter === "all" || item.group === filter;

    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase());

    return matchesGroup && matchesSearch;
  });

  return (
    <>

      <div className="section bg-white">
        <div className="container px-[10%] lg:px-[15%]">
          <div className="flex justify-center mt-6">

            <div className="w-full md:w-[80%] bg-white border border-[#D32F2F] rounded-2xl p-4 shadow-sm">

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                {/* 🔍 SEARCH */}
                <div className="relative w-full md:w-[40%]">

                  <input
                    type="text"
                    placeholder="ابحث عن التخصص"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-xl border border-[#D9D9D9] focus:outline-none focus:border-[#D32F2F]"
                  />

                  <Search
                    size={18}
                    className="absolute right-3 top-2.5 text-[#D32F2F]"
                  />
                </div>

                {/* 🔘 BUTTONS */}
                <div className="flex gap-2 flex-wrap justify-center">

                  {buttons.map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setFilter(btn.id)}
                      className={`px-4 py-2 rounded-xl text-sm transition ${
                        filter === btn.id
                          ? "bg-[#D32F2F] text-white shadow-md"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="p-6  bg-white">

        <div className="container px-[10%] lg:px-[10%]">

        <div className="grid grid-cols-1 md:grid-cols-3  gap-4">

          {filtered.map((item) => (
            <ClinicCard
              key={item.id}
                 id={item.id}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
              color={item.color}
            />
          ))}

        </div>
        </div>


      </div>
    </>
  );
}