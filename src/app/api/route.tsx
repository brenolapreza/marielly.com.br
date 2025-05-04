import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "Requisição inválida" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const body = await req.json();

  const { email, password } = body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const headers = new Headers();
    headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 3600,
      })
    );

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
