import { api } from "@/lib/api";

export type PatientNotification = {
  id: number;
  type: string;
  title: string;
  body?: string | null;
  link_path?: string | null;
  related_type?: string | null;
  related_id?: number | null;
  is_read: boolean;
  created_at: string;
};

export type NotificationsResponse = {
  notifications: PatientNotification[];
  unread_count: number;
};

export async function fetchMyNotifications(
  token: string,
  limit = 30,
): Promise<NotificationsResponse> {
  return api<NotificationsResponse>(`/notifications/me?limit=${limit}`, {
    auth: true,
    token,
  });
}

export async function markNotificationRead(token: string, id: number) {
  return api<{ ok: boolean }>(`/notifications/${id}/read`, {
    method: "PATCH",
    auth: true,
    token,
  });
}

export async function markAllNotificationsRead(token: string) {
  return api<{ ok: boolean; updated: number }>("/notifications/me/read-all", {
    method: "POST",
    auth: true,
    token,
  });
}

export function formatNotificationTime(value: string) {
  try {
    return new Date(value).toLocaleString("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}
