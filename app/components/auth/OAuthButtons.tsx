"use client";

import { signIn } from "next-auth/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

type OAuthButtonsProps = {
  callbackUrl?: string;
  googleEnabled?: boolean;
  facebookEnabled?: boolean;
};

export default function OAuthButtons({
  callbackUrl = "/",
  googleEnabled = true,
  facebookEnabled = true,
}: OAuthButtonsProps) {
  return (
    <div className="mt-5 space-y-3">
      <div className="relative my-1 text-center text-xs text-muted">
        <span className="relative z-10 bg-white px-3">أو المتابعة عبر</span>
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!googleEnabled}
          onClick={() => signIn("google", { callbackUrl })}
          className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-[#f8fbfa] px-3 py-3 text-sm font-semibold text-ink transition hover:border-[#ea4335]/35 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          <FaGoogle className="text-[#ea4335]" />
          Google
        </button>

        <button
          type="button"
          disabled={!facebookEnabled}
          onClick={() => signIn("facebook", { callbackUrl })}
          className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-[#f8fbfa] px-3 py-3 text-sm font-semibold text-ink transition hover:border-[#1877f2]/35 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          <FaFacebook className="text-[#1877f2]" />
          Facebook
        </button>
      </div>

      {!googleEnabled || !facebookEnabled ? (
        <p className="text-center text-[11px] leading-relaxed text-muted">
          لتفعيل Google/Facebook أضف المفاتيح في ملف البيئة.
        </p>
      ) : null}
    </div>
  );
}
