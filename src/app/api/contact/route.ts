import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().optional().default(""),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "nicolasparis.dg@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Nicolas Paris <onboarding@resend.dev>";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY missing" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { name, email, message } = parsed.data;

  await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Nueva consulta de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
