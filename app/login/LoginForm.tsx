"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CreditCard, LogIn, Phone, UserRound } from "lucide-react";
import AuthShell from "@/app/components/auth/AuthShell";
import OAuthButtons from "@/app/components/auth/OAuthButtons";

type LoginFormProps = {
  googleEnabled: boolean;
  facebookEnabled: boolean;
};

const inputClass =
  "w-full rounded-2xl border border-line bg-[#f8fbfa] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#199e3f] focus:bg-white focus:ring-2 focus:ring-[#199e3f]/20";

export default function LoginForm({
  googleEnabled,
  facebookEnabled,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const authError = searchParams.get("error");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState(
    authError ? "تعذر تسجيل الدخول. حاول مرة أخرى." : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      name: name.trim(),
      phone: phone.trim(),
      national_id: nationalId.trim(),
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("بيانات الدخول غير صحيحة. تحقق من الاسم ورقم الجوال ورقم الهوية.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthShell
      title="تسجيل الدخول"
      subtitle="أدخل اسمك ورقم جوالك ورقم هويتك لمتابعة مواعيدك."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
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
              onChange={(event) => setPhone(event.target.value)}
              required
              autoComplete="tel"
              dir="ltr"
              placeholder="05xxxxxxxx"
              className={inputClass}
            />
          </div>
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
              onChange={(event) => setNationalId(event.target.value)}
              required
              inputMode="numeric"
              dir="ltr"
              placeholder="xxxxxxxxxxx"
              className={inputClass}
            />
          </div>
        </label>

        {error ? (
          <p className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm text-rose-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#199e3f] to-[#0e6c09] px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(25,158,63,0.55)] transition hover:brightness-105 disabled:opacity-70"
        >
          <LogIn size={18} />
          {loading ? "جاري الدخول..." : "تسجيل الدخول"}
        </button>
      </form>

      <OAuthButtons
        callbackUrl={callbackUrl}
        googleEnabled={googleEnabled}
        facebookEnabled={facebookEnabled}
      />

      <p className="mt-6 text-center text-sm text-muted">
        ليس لديك حساب؟{" "}
        <Link
          href="/register"
          className="font-bold text-[#d2151e] transition hover:underline"
        >
          إنشاء حساب جديد
        </Link>
      </p>
    </AuthShell>
  );
}
