import { NextResponse } from "next/server";

import { loginUser } from "@/lib/supabaseClient";

type LoginPayload = {
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as LoginPayload;

    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    const data = await loginUser(email, password);

    return NextResponse.json({ message: "Успешный вход", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
