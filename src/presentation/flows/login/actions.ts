"use server";

import type { IHandleSubmitServerAction } from "./login.types";

export const onSubmit = async (
  formData: FormData
): Promise<IHandleSubmitServerAction> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.error, status: res.status };
    }

    const data = await res.json();
    return { data, status: 200 };
  } catch {
    return { error: "Email ou senha inválidos", status: 500 };
  }
};
