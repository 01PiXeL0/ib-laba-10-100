import { NextResponse } from "next/server";

import { registerUser } from "@/lib/supabaseClient";

type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

export async function POST(request: Request) {
  try {
    const { email, password, name } = (await request.json()) as RegisterPayload;

    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    const data = await registerUser(email, password, name ? { name } : undefined);

    return NextResponse.json({ message: "Регистрация создана, подтвердите email при необходимости", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
