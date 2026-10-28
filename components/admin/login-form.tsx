"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "@/components/site/logo";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        window.location.reload();
        return;
      }
      setError(response.status === 429 ? "Too many attempts. Wait 15 minutes and try again." : "Those credentials aren't right.");
    } catch {
      setError("Network error. Try again.");
    }
    setBusy(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-[var(--adm-line)] bg-[var(--adm-surface)] p-7">
        <div className="flex items-center gap-2.5">
          <LogoMark size={26} />
          <span className="font-display text-lg font-semibold tracking-tight">VibeJudge</span>
        </div>
        <h1 className="mt-6 font-display text-xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-[var(--adm-muted)]">Administrator sign-in.</p>

        <label className="mt-6 block text-sm font-medium" htmlFor="admin-user">
          Username
        </label>
        <input
          id="admin-user"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--adm-line-strong)] bg-[var(--adm-bg)] px-3 py-2.5 text-sm outline-none focus:border-[var(--adm-accent)] focus:ring-2 focus:ring-[var(--adm-accent-soft)]"
          required
        />
        <label className="mt-4 block text-sm font-medium" htmlFor="admin-pass">
          Password
        </label>
        <input
          id="admin-pass"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--adm-line-strong)] bg-[var(--adm-bg)] px-3 py-2.5 text-sm outline-none focus:border-[var(--adm-accent)] focus:ring-2 focus:ring-[var(--adm-accent-soft)]"
          required
        />
        {error ? (
          <p className="mt-3 text-sm text-[var(--adm-bad)]" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--adm-text)] px-4 py-2.5 text-sm font-semibold text-[var(--adm-bg)] transition hover:opacity-90 disabled:opacity-60"
        >
          <Lock size={15} aria-hidden />
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
