import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "إنشاء حساب | جمعية الخدمة العامة",
  description: "إنشاء حساب مريض جديد",
};

export default function RegisterPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const facebookEnabled = Boolean(
    process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET,
  );

  return (
    <RegisterForm
      googleEnabled={googleEnabled}
      facebookEnabled={facebookEnabled}
    />
  );
}
