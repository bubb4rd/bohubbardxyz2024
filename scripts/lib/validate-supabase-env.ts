export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  };
}

function decodeJwtRole(key: string): string | null {
  try {
    const payload = key.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof json.role === "string" ? json.role : null;
  } catch {
    return null;
  }
}

function describeKey(key: string | undefined): string {
  if (!key) return "missing";
  if (key.startsWith("sb_publishable_")) return "publishable (sb_publishable_...)";
  if (key.startsWith("sb_secret_")) return "secret (sb_secret_...)";
  if (key.startsWith("eyJ")) {
    const role = decodeJwtRole(key);
    return role ? `legacy JWT (${role})` : "legacy JWT";
  }
  if (key.includes("your-") || key === "your-anon-key" || key === "your-service-role-key") {
    return "placeholder from .env.example";
  }
  return `unrecognized format (length ${key.length})`;
}

export function validateSupabaseEnv(options?: { requireServiceKey?: boolean }) {
  const { url, anonKey, serviceKey } = getSupabaseEnv();
  const errors: string[] = [];

  if (!url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is missing.");
  } else if (!/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/i.test(url)) {
    errors.push(
      "NEXT_PUBLIC_SUPABASE_URL should look like https://abcdefgh.supabase.co",
    );
  }

  if (!anonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  } else if (describeKey(anonKey).startsWith("unrecognized")) {
    errors.push(
      `NEXT_PUBLIC_SUPABASE_ANON_KEY looks wrong (${describeKey(anonKey)}). Use the anon/public key from Supabase → Project Settings → API.`,
    );
  }

  if (options?.requireServiceKey !== false) {
    if (!serviceKey) {
      errors.push("SUPABASE_SERVICE_ROLE_KEY is missing.");
    } else if (serviceKey === anonKey) {
      errors.push(
        "SUPABASE_SERVICE_ROLE_KEY must not be the same as NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
    } else {
      const kind = describeKey(serviceKey);
      if (kind.startsWith("unrecognized") || kind.startsWith("placeholder")) {
        errors.push(
          `SUPABASE_SERVICE_ROLE_KEY looks wrong (${kind}). Use the service_role / secret key from Supabase → Project Settings → API.`,
        );
      } else if (kind.includes("publishable") || kind.includes("anon")) {
        errors.push(
          "SUPABASE_SERVICE_ROLE_KEY must be the service_role or secret key, not the anon/publishable key.",
        );
      }
    }
  }

  return { ok: errors.length === 0, errors, url, anonKey, serviceKey };
}

export function printSupabaseEnvHelp() {
  console.error(`
Supabase env vars look incorrect.

Where to find the right values:
1. Open https://supabase.com/dashboard
2. Select your project
3. Go to Project Settings → API (or API Keys)

Copy these exactly (no quotes, no extra spaces):
- NEXT_PUBLIC_SUPABASE_URL      → Project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY → anon / publishable key
- SUPABASE_SERVICE_ROLE_KEY     → service_role / secret key

Valid key formats:
- Legacy JWT keys: long strings starting with "eyJ..." (200+ characters)
- New keys: "sb_publishable_..." and "sb_secret_..."

Do NOT use the project ref, database password, or JWT secret.
After updating .env.local, run: npm run verify:supabase
`);
}
