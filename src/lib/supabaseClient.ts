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
const FALLBACK_URL = "https://hxfuolhkahksdzvaglyh.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZnVvbGhrYWhrc2R6dmFnbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTIzNzUsImV4cCI6MjA3OTMyODM3NX0.upngCGYqwS0pDZ_pS_mw-yLeIoc2PtDN_-3IyKfv468";
const FALLBACK_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZnVvbGhrYWhrc2R6dmFnbHloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MjM3NSwiZXhwIjoyMDc5MzI4Mzc1fQ.kEayBAn8zjKOmmW9JAta-KmYmfhEXyEHb0Y6PMySV2k";

export type SupabaseAuthContext = "anon" | "service";

export type SupabaseRequestOptions = {
  /**
   * Path that will be appended to the Supabase base URL.
   * Example: `/rest/v1/notes?select=*`.
   */
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  auth?: SupabaseAuthContext;
  signal?: AbortSignal;
  cache?: RequestCache;
};

const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? FALLBACK_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? FALLBACK_SERVICE_ROLE_KEY,
};

const normalizedBaseUrl = supabaseConfig.url.endsWith("/")
  ? supabaseConfig.url
  : `${supabaseConfig.url}/`;

function resolveAuthToken(auth: SupabaseAuthContext = "anon") {
  return auth === "service" ? supabaseConfig.serviceRoleKey : supabaseConfig.anonKey;
}

export function buildSupabaseHeaders(
  auth: SupabaseAuthContext = "anon",
  additionalHeaders: HeadersInit = {}
) {
  const token = resolveAuthToken(auth);

  if (!token) {
    throw new Error("Missing Supabase authentication token");
  }

  return {
    apikey: token,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...additionalHeaders,
  } satisfies HeadersInit;
}

export async function supabaseFetch<TResponse>(options: SupabaseRequestOptions) {
  const { path, method = "GET", body, headers, auth = "anon", signal, cache } = options;
  const url = new URL(path.replace(/^\//, ""), normalizedBaseUrl);
  const requestInit: RequestInit = {
    method,
    headers: buildSupabaseHeaders(auth, headers),
    signal,
    cache,
  };

  if (body !== undefined) {
    requestInit.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(url.toString(), requestInit);
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    const errorPayload = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    throw new Error(
      `Supabase request failed with status ${response.status}: ${JSON.stringify(errorPayload)}`
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  if (contentType?.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as unknown as TResponse;
}

export const supabase = {
  config: supabaseConfig,
  fetch: supabaseFetch,
  buildHeaders: buildSupabaseHeaders,
};
