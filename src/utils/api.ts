const BASE_API_URL = "http://localhost:8080/api/v1/";

export const fetchData = async <T, B = undefined>(
    url: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    token?: string | null,
    body?: B,
): Promise<T> => {
  try {
    const response = await fetch(BASE_API_URL + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token && {Authorization: `Bearer ${token}`}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to fetch: ${response.status} - ${errorResponse.message || "Unknown error"}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
