const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

export async function api(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL belum diatur. Periksa file .env.");
  }

  const { body, headers, ...requestOptions } = options;
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result?.message ?? `Permintaan gagal (${response.status}).`,
    );
    error.status = response.status;
    throw error;
  }

  return result?.data;
}
