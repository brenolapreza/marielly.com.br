"use client";

import { useState } from "react";
import { onSubmit } from "./actions";

export const LoginLayout: React.FC = () => {
  const [errorState, setErrorState] = useState<string | undefined>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await onSubmit(formData);
    console.log(result);
    if ("error" in result && result.error) {
      setErrorState(result.error as string);
    } else {
      alert("Login successful!");
    }
  };
  const onChange = () => {
    setErrorState(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-tertiary mb-6 text-center">
          Login
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            onChange={onChange}
            name="email"
            type="email"
            placeholder="Email"
            className="bg-white/20 text-tertiary placeholder-tertiary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
          <input
            onChange={onChange}
            name="password"
            type="password"
            placeholder="Senha"
            className="bg-white/20 text-tertiary placeholder-tertiary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
          {errorState && (
            <span className="text-red-800 text-center">{errorState}</span>
          )}
          <button
            type="submit"
            className="bg-white/20 text-tertiary font-medium py-2 rounded-lg hover:bg-white/30 transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
