export const BASE_API_URL = "http://localhost:8080/api/v1/";

export const fetchBlobData = async (url: string, method: string, token?: string | null): Promise<Blob> => {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token ?? ""}` } : {};

  const response = await fetch(`${BASE_API_URL}${url}`, {
    method,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return await response.blob();
};

export const fetchData = async <T, B = unknown>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  token: string | null = null,
  body?: B,
): Promise<T | null> => {
  try {
    const isFormData = body instanceof FormData;
    const response = await fetch(BASE_API_URL + url, {
      method: method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      },
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorResponse = await response.json();
        errorMessage += ` - ${errorResponse.message || "Unknown error"}`;
      } catch {
        errorMessage += " - Unable to parse error response.";
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      return (await response.json()) as T;
    } else if (contentType?.includes("text/plain")) {
      return (await response.text()) as T;
    } else {
      return (await response.blob()) as T;
    }
  } catch (error) {
    console.error("Fetch error:", {
      url,
      method,
      body,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
};
