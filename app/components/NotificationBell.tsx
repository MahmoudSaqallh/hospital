"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, CheckCheck } from "lucide-react";
import {
  fetchMyNotifications,
  formatNotificationTime,
  markAllNotificationsRead,
  markNotificationRead,
  type PatientNotification,
} from "@/lib/notifications";

type NotificationBellProps = {
  /** Close mobile menu when navigating */
  onNavigate?: () => void;
  className?: string;
};

export default function NotificationBell({
  onNavigate,
  className = "",
}: NotificationBellProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PatientNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (status !== "authenticated" || !session?.accessToken) return;
    setLoading(true);
    try {
      const data = await fetchMyNotifications(session.accessToken, 25);
      setItems(data.notifications);
      setUnread(data.unread_count);
    } catch {
      // keep previous list on transient errors
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, status]);

  useEffect(() => {
    if (status !== "authenticated") {
      setItems([]);
      setUnread(0);
      return;
    }
    load();
    const id = window.setInterval(load, 45000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [status, load]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (status !== "authenticated" || !session?.accessToken) {
    return null;
  }

  async function handleOpenToggle() {
    const next = !open;
    setOpen(next);
    if (next) await load();
  }

  async function handleItemClick(item: PatientNotification) {
    if (!session?.accessToken) return;
    if (!item.is_read) {
      try {
        await markNotificationRead(session.accessToken, item.id);
        setItems((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)),
        );
        setUnread((c) => Math.max(0, c - 1));
      } catch {
        // ignore
      }
    }
    setOpen(false);
    onNavigate?.();
  }

  async function handleMarkAll() {
    if (!session?.accessToken || unread === 0) return;
    try {
      await markAllNotificationsRead(session.accessToken);
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {
      // ignore
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleOpenToggle}
        aria-label="الإشعارات"
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      >
        <Bell size={18} />
        {unread > 0 ? (
          <span className="absolute -top-1 -start-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute end-0 top-[calc(100%+0.5rem)] z-[120] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_50px_-20px_rgba(15,34,51,0.35)]">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-bold text-ink">إشعاراتي</p>
              <p className="text-xs text-muted">
                {unread > 0 ? `${unread} غير مقروء` : "لا يوجد جديد"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={unread === 0}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-40"
            >
              <CheckCheck size={14} />
              قراءة الكل
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">جاري التحميل...</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">لا توجد إشعارات بعد</p>
            ) : (
              <ul>
                {items.map((item) => {
                  const href = item.link_path || "/patient";
                  return (
                    <li key={item.id} className="border-b border-line last:border-b-0">
                      <Link
                        href={href}
                        onClick={() => handleItemClick(item)}
                        className={`block px-4 py-3 text-right transition hover:bg-primary/5 ${
                          item.is_read ? "bg-white" : "bg-primary/[0.04]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-ink">{item.title}</p>
                          {!item.is_read ? (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          ) : null}
                        </div>
                        {item.body ? (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                            {item.body}
                          </p>
                        ) : null}
                        <p className="mt-1.5 text-[11px] text-muted">
                          {formatNotificationTime(item.created_at)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
