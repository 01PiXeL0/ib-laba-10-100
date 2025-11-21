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
