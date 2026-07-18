import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "تسجيل الدخول | جمعية الخدمة العامة",
  description: "تسجيل دخول المرضى لمتابعة المواعيد",
};

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const facebookEnabled = Boolean(
    process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET,
  );

  return (
    <Suspense
      fallback={
        <div className="container-custom flex justify-center py-20">
          <div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-white/80" />
        </div>
      }
    >
      <LoginForm
        googleEnabled={googleEnabled}
        facebookEnabled={facebookEnabled}
      />
    </Suspense>
  );
}
