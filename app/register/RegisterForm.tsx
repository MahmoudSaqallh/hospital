"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CreditCard, Phone, UserPlus, UserRound } from "lucide-react";
import AuthShell from "@/app/components/auth/AuthShell";
import OAuthButtons from "@/app/components/auth/OAuthButtons";
import {
  digitsOnly,
  validatePatientNationalId,
  validatePatientPhone,
} from "@/lib/patientValidation";

type RegisterFormProps = {
  googleEnabled: boolean;
  facebookEnabled: boolean;
};

const inputClass =
  "w-full rounded-2xl border border-line bg-[#f8fbfa] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#199e3f] focus:bg-white focus:ring-2 focus:ring-[#199e3f]/20";

export default function RegisterForm({
  googleEnabled,
  facebookEnabled,
}: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const phoneCheck = validatePatientPhone(phone);
    if (!phoneCheck.ok) {
      setError(phoneCheck.error);
      return;
    }

    const idCheck = validatePatientNationalId(nationalId);
    if (!idCheck.ok) {
      setError(idCheck.error);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phoneCheck.value,
          national_id: idCheck.value,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "تعذر إنشاء الحساب");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        name: name.trim(),
        phone: phoneCheck.value,
        national_id: idCheck.value,
        redirect: false,
        callbackUrl: "/",
      });

      setLoading(false);

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
      setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
    }
  }

  return (
    <AuthShell
      title="إنشاء حساب جديد"
      subtitle="سجّل بياناتك برقم الهوية والجوال لمتابعة الحجوزات بسهولة."
    >
      <form className="space-y-3.5" onSubmit={onSubmit}>
        <label className="block text-sm font-semibold text-ink">
          الاسم الكامل
          <div className="relative mt-1.5">
            <UserRound
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              autoComplete="name"
              className={inputClass}
            />
          </div>
        </label>

        <label className="block text-sm font-semibold text-ink">
          رقم الجوال
          <div className="relative mt-1.5">
            <Phone
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(digitsOnly(event.target.value, 10))}
              required
              autoComplete="tel"
              dir="ltr"
              inputMode="numeric"
              maxLength={10}
              pattern="0(59|56)[0-9]{7}"
              placeholder="059xxxxxxx"
              className={inputClass}
            />
          </div>
          <p className="mt-1 text-xs text-muted">10 أرقام ويبدأ بـ 059 أو 056</p>
        </label>

        <label className="block text-sm font-semibold text-ink">
          رقم الهوية
          <div className="relative mt-1.5">
            <CreditCard
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={nationalId}
              onChange={(event) => setNationalId(digitsOnly(event.target.value, 10))}
              required
              inputMode="numeric"
              dir="ltr"
              maxLength={10}
              pattern="[0-9]{10}"
              placeholder="xxxxxxxxxx"
              className={inputClass}
            />
          </div>
          <p className="mt-1 text-xs text-muted">10 أرقام</p>
        </label>

        {error ? (
          <p className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm text-rose-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#d2151e] to-[#a51218] px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(210,21,30,0.5)] transition hover:brightness-105 disabled:opacity-70"
        >
          <UserPlus size={18} />
          {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
        </button>
      </form>

      <OAuthButtons
        googleEnabled={googleEnabled}
        facebookEnabled={facebookEnabled}
      />

      <p className="mt-6 text-center text-sm text-muted">
        لديك حساب بالفعل؟{" "}
        <Link
          href="/login"
          className="font-bold text-[#199e3f] transition hover:underline"
        >
          تسجيل الدخول
        </Link>
      </p>
    </AuthShell>
  );
}
