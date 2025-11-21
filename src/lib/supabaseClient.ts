const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type HeadersInit = Record<string, string>;

type SupabaseInsertOptions = {
  table: string;
  payload: Record<string, unknown>;
  preferReturn?: "minimal" | "representation";
  jwt?: string;
};

function ensureEnv() {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!SUPABASE_ANON_KEY) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}

async function supabaseFetch(path: string, init?: RequestInit) {
  ensureEnv();
  const url = `${SUPABASE_URL!.replace(/\/$/, "")}${path}`;
  const response = await fetch(url, init);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase error ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function insertRecord({ table, payload, preferReturn = "representation", jwt }: SupabaseInsertOptions) {
  ensureEnv();
  const headers: HeadersInit = {
    apikey: SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${jwt || SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!}`,
    "Content-Type": "application/json",
    Prefer: `return=${preferReturn}`,
  };

  return supabaseFetch(`/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function upsertRecord({ table, payload, preferReturn = "representation", jwt }: SupabaseInsertOptions) {
  ensureEnv();
  const headers: HeadersInit = {
    apikey: SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${jwt || SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!}`,
    "Content-Type": "application/json",
    Prefer: `return=${preferReturn},resolution=merge-duplicates`,
  };

  return supabaseFetch(`/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function logEvent(table: string, payload: Record<string, unknown>) {
  return insertRecord({ table, payload, preferReturn: "minimal" });
}

export function supabaseHeaders(jwt?: string) {
  ensureEnv();
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${jwt || SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!}`,
  } as HeadersInit;
}
