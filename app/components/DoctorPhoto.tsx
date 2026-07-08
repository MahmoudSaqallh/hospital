"use client";

import Image from "next/image";
import { useState } from "react";
import { UserRound } from "lucide-react";

type DoctorPhotoProps = {
  name: string;
  photo?: string;
  size?: "md" | "lg";
};

const PLACEHOLDER = "/doctors/placeholder.svg";

function fallbackAvatarUrl(name: string) {
  const label = encodeURIComponent(name.replace(/^د\.\s?/, "").trim() || "طبيب");
  return `https://ui-avatars.com/api/?name=${label}&background=0e7490&color=fff&size=256&bold=true&format=png`;
}

export default function DoctorPhoto({ name, photo, size = "lg" }: DoctorPhotoProps) {
  const [failed, setFailed] = useState(false);

  const dimensions = size === "lg" ? "h-28 w-28 sm:h-32 sm:w-32" : "h-20 w-20";
  const pixelSize = size === "lg" ? 128 : 80;

  const src = failed
    ? fallbackAvatarUrl(name)
    : photo?.trim() || PLACEHOLDER;

  const isRemote = src.startsWith("http");

  return (
    <div
      className={`relative ${dimensions} shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-white shadow-md ring-4 ring-primary/5`}
    >
      <Image
        src={src}
        alt={`صورة ${name}`}
        width={pixelSize}
        height={pixelSize}
        className="h-full w-full object-cover object-top"
        unoptimized={isRemote}
        priority={Boolean(photo)}
        onError={() => setFailed(true)}
      />
      <span className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-primary shadow-sm backdrop-blur">
        <UserRound size={16} />
      </span>
    </div>
  );
}
