import { Suspense } from "react";
import BookingClient from "./BookingClient";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <section className="container-custom py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <div className="h-10 w-48 animate-pulse rounded-lg bg-line/60" />
            <div className="mt-6 h-72 animate-pulse rounded-3xl bg-white/80" />
          </div>
        </section>
      }
    >
      <BookingClient />
    </Suspense>
  );
}
