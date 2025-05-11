import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body) return null;
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 3600, // 1hr
      })
    );

    return res.status(200).json({ message: "Login successful" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function GET() {
  try {
    const sections = await prisma.section.findMany();
    return new Response(JSON.stringify(sections), { status: 200 });
  } catch {
    return new Response(
      JSON.stringify({ error: "Erro ao buscar as seções." }),
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { sectionId, content } = await request.json();
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: {
        content: content,
      },
    });
    return new Response(JSON.stringify(updatedSection), { status: 200 });
  } catch {
    return new Response(
      JSON.stringify({ error: "Erro ao atualizar a seção." }),
      { status: 500 }
    );
  }
}
