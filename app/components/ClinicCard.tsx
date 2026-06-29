import Link from "next/link";

type Props = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  color: string;
};

export default function ClinicCard({
  id,
  title,
  desc,
  icon,
  color,
}: Props) {
  return (
    <div className="bg-white border border-[#F0F0F0] rounded-2xl p-5 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center">

      {/* ICON */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: color + "20" }}
      >
        <span
          className="material-symbols-outlined text-[28px]"
          style={{ color }}
        >
          {icon}
        </span>
      </div>

      {/* TITLE */}
      <h3 className="font-bold text-[#212121] text-lg">
        {title}
      </h3>

      {/* DESC */}
      <p className="text-sm text-gray-500 mt-2">
        {desc}
      </p>

      {/* BUTTON */}
      <Link href={`/schedule/${id}`}>
        <button className="mt-4 w-full py-2 rounded-xl border border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition">
          عرض الجدول
        </button>
      </Link>

    </div>
  );
}