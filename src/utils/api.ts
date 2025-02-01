const BASE_API_URL = "http://localhost:8080/api/v1/";

export const fetchData = async <T, B = undefined>(
    url: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    token: string | null = null,
    body?: B,
): Promise<T | null> => {
  try {
    const response = await fetch(BASE_API_URL + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch: ${response.status}`;
      try {
        const errorResponse = await response.json();
        errorMessage += ` - ${errorResponse.message || "Unknown error"}`;
      } catch {
        errorMessage += " - Unable to parse error response.";
      }
      throw new Error(errorMessage);
    }

    // return await response.json();


    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) as T : null;
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
