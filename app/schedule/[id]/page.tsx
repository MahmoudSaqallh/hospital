"use client";

import data from "../../jsonData/scheduleWithDoctors.json";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();

  const department = data.find((item) => item.id == id);

  if (!department) return <div>Not Found</div>;

  return (
    <div className="px-[10%] lg:px-[20%] py-10">

      <h1 className="text-2xl font-bold text-red-600 mb-6">
        {department.title}
      </h1>

      <div className="space-y-6">

        {department.doctors.map((doc: any, i: number) => (
          <div key={i} className="bg-white p-5 rounded-xl border">

            {/* اسم الدكتور */}
            <h2 className="font-bold text-lg mb-3">
              {doc.name}
            </h2>

            {/* الجدول */}
            <div className="grid grid-cols-6 gap-2 text-center text-sm">

              {Object.entries(doc.schedule).map(([day, value]: any) => (
                <div
                  key={day}
                  className={`p-2 rounded border ${
                    value === "إجازة"
                      ? "bg-red-50 text-red-500"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="font-semibold">{day}</div>
                  <div className="text-xs">{value}</div>
                </div>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}