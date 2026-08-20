"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function CmsLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/cms/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error || "Não foi possível entrar.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Não foi possível conectar ao CMS.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cms-login-page">
      <section className="cms-login-card" aria-labelledby="cms-login-title">
        <div className="cms-brand"><span className="cms-brand-mark">ML</span><span>Área de configuração</span></div>
        <h1 id="cms-login-title">Bem-vinda.</h1>
        <p>Entre para atualizar o conteúdo, as imagens e a identidade visual do seu site.</p>
        <form className="cms-login-form" onSubmit={handleSubmit}>
          <div className="cms-field"><label htmlFor="cms-username">Usuário</label><input id="cms-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></div>
          <div className="cms-field"><label htmlFor="cms-password">Senha</label><input id="cms-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          {error && <p className="cms-login-error" role="alert">{error}</p>}
          <button className="cms-login-button" type="submit" disabled={loading}>{loading ? "Entrando..." : "Acessar configuração"}</button>
        </form>
        <Link className="cms-back" href="/">← Voltar para o site</Link>
      </section>
    </main>
  );
}
