import Image from "next/image";
import Logo from "../../../public/image/لوجو الصفحة.png";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative isolate min-h-[calc(100vh-84px)] overflow-hidden sm:min-h-[calc(100vh-92px)]">
      {/* Brand atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f7fbf8] to-[#eef6f1]" />
        <div
          className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "rgba(210, 21, 30, 0.22)" }}
        />
        <div
          className="absolute -bottom-28 left-[-8%] h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "rgba(25, 158, 63, 0.2)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background:
              "linear-gradient(90deg, #199e3f 0%, #d2151e 50%, #0f2233 100%)",
          }}
        />
      </div>

      <div className="container-custom flex flex-col items-center py-8 sm:py-12">
        <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <div className="relative mb-4 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full p-[3px]"
              style={{
                background:
                  "conic-gradient(from 210deg, #199e3f 0deg 115deg, #d2151e 115deg 235deg, #0f2233 235deg 360deg)",
              }}
            >
              <div className="h-full w-full rounded-full bg-white" />
            </div>
            <Image
              src={Logo}
              alt="شعار جمعية الخدمة العامة"
              width={112}
              height={112}
              priority
              className="relative z-10 h-[82%] w-[82%] object-contain"
            />
          </div>

          <p className="text-base font-bold text-[#d2151e] sm:text-lg">
            جمعية الخدمة العامة
          </p>
          <p className="mt-0.5 text-xs font-medium tracking-wide text-[#0f2233] sm:text-sm">
            Public Aid Society
          </p>
          <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {subtitle}
          </p>
        </div>

        <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_-28px_rgba(15,34,51,0.28)] backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
