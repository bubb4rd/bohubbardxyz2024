"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/admin/actions";
import { FormStatus } from "@/components/admin/FormStatus";

export default function AdminLoginPage() {
  const [result, action, pending] = useActionState(signIn, null);

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4">
      <div className="admin-card w-full max-w-md space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Portfolio Admin
          </p>
          <h1 className="font-display text-2xl font-semibold text-white">
            Sign in
          </h1>
        </div>

        <form action={action} className="space-y-4">
          <div className="admin-field">
            <label htmlFor="email" className="admin-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="admin-input w-full"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="password" className="admin-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="admin-input w-full"
            />
          </div>

          <FormStatus result={result} />

          <button type="submit" disabled={pending} className="admin-button w-full">
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
