const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

export async function apiRequest(path: string, options: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
