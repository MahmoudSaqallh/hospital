import { Clock, Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <>
    <section className="text-center py-12 space-y-6 bg-[#fdfefd]">
        <div className="container px-[10%] lg:px-[25%] py-5">
             {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#D32F2F] mb-5">
        عيادات جمعية الخدمة العامة
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-2xl mx-auto leading-relaxed mb-5">
        نقدم خدمات طبية متكاملة برؤية إنسانية، مجهزين بأحدث التقنيات الطبية
        وكادر من الاستشاريين المتخصصين لضمان أفضل رعاية صحية لكم ولعائلاتكم.
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-3 flex-wrap">

        {/* 24/7 */}
        <button className="flex items-center gap-2 bg-[#00799C] text-white px-5 py-2 rounded-full shadow-sm hover:scale-105 transition">
          <Clock size={18} />
          <span>متاح 24/7 للحالات الطارئة</span>
        </button>

        {/* Advanced Care */}
        <button className="flex items-center gap-2 bg-green-400 text-white px-5 py-2 rounded-full shadow-sm hover:scale-105 transition">
          <Sparkles size={18} />
          <span>رعاية متقدمة</span>
        </button>

      </div>

        </div>
    </section>
        </>
    )
}
