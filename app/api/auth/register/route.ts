import { NextResponse } from "next/server";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";

const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جداً"),
  phone: z
    .string()
    .trim()
    .min(9, "رقم الجوال غير صالح")
    .regex(/^[0-9+\-\s]+$/, "رقم الجوال غير صالح"),
  national_id: z
    .string()
    .trim()
    .min(5, "رقم الهوية غير صالح")
    .regex(/^[0-9]+$/, "رقم الهوية يجب أن يكون أرقاماً فقط"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "بيانات غير صالحة";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const result = await api<{
      token: string;
      user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        national_id?: string | null;
        role: string;
      };
    }>("/auth/register", {
      method: "POST",
      body: parsed.data,
    });

    return NextResponse.json(
      {
        user: {
          id: String(result.user.id),
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          national_id: result.user.national_id,
        },
        accessToken: result.token,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 409) {
        return NextResponse.json(
          { error: "رقم الهوية مسجّل مسبقاً" },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 });
  }
}
