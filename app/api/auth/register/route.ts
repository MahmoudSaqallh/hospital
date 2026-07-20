import { NextResponse } from "next/server";
import { api, ApiError } from "@/lib/api";
import { patientRegisterSchema } from "@/lib/patientValidation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = patientRegisterSchema.safeParse(body);

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
