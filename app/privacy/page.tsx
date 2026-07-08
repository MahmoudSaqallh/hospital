import { ShieldCheck } from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";

const points = [
  "يتم استخدام بيانات الاتصال فقط لإدارة المواعيد والتذكير.",
  "يمكن للمريض طلب تحديث أو حذف بياناته عبر صفحة التواصل.",
  "لا يتم مشاركة البيانات مع أطراف خارجية دون موافقة المريض.",
];

export default function PrivacyPage() {
  return (
    <section className="container-custom max-w-3xl py-8 sm:py-12">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white shadow-sm">
            <ShieldCheck size={26} />
          </span>
          <h1 className="text-ink">سياسة الخصوصية</h1>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          نلتزم بحماية بيانات المرضى وعدم استخدامها إلا لتأكيد المواعيد وتقديم الخدمات الطبية.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="card mt-6 divide-y divide-line p-2">
          {points.map((point) => (
            <div key={point} className="flex items-start gap-3 p-4 text-sm text-ink">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full gradient-primary" />
              {point}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
