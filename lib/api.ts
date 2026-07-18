const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  payload: Record<string, unknown>;
  constructor(
    message: string,
    status: number,
    payload: Record<string, unknown> = {},
  ) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  auth?: boolean;
};

export async function api<T = unknown>(
  path: string,
  { method = "GET", body, token, auth = false }: ApiOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
    [key: string]: unknown;
  };

  if (!res.ok) {
    throw new ApiError(
      (data.message as string) || (data.error as string) || "Request failed",
      res.status,
      data,
    );
  }

  return data as T;
}

export { API_URL };

/** Multipart POST (e.g. complaint with image/PDF). Do not set Content-Type. */
export async function apiForm<T = unknown>(
  path: string,
  formData: FormData,
  { token }: { token: string },
): Promise<T> {
  const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
  };

  if (!res.ok) {
    throw new ApiError(data.message || data.error || "Request failed", res.status, data);
  }

  return data as T;
}
