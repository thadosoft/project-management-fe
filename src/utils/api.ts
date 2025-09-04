import tokenService from "@/services/tokenService";

export const BASE_API_URL = "http://localhost:8080/api/v1/";
// export const BASE_API_URL = "https://parker-software-embedded-optimum.trycloudflare.com/api/v1/";

export const fetchData = async <T, B = unknown>(
    url: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    token: string | null = null,
    body?: B,
    options?: { responseType?: "json" | "text" | "blob" }
): Promise<T | null> => {
    try {
        const isFormData = body instanceof FormData;
        const tokenFromStorage = tokenService.accessToken;

        const response = await fetch(BASE_API_URL + url, {
            method: method,
            headers: {
                ...(token || tokenFromStorage ? { Authorization: `Bearer ${token || tokenFromStorage}` } : {}),
                ...(!isFormData && method !== "GET" ? { "Content-Type": "application/json" } : {}),
            },
            body: isFormData
                ? (body as FormData)
                : body && method !== "GET"
                ? JSON.stringify(body)
                : undefined,
        });

        // ✅ Nếu BE trả về 401 → clear token + redirect
        if (response.status === 401) {
            console.warn("Token expired or unauthorized. Redirecting to login...");
            tokenService.accessToken = null;
            localStorage.removeItem("id");
            localStorage.removeItem("role");
            window.location.href = "/login";
            return null;
        }

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

        // Xử lý theo responseType
        if (options?.responseType === "blob") {
            const blob = await response.blob();
            return blob as T;
        }

        const contentType = response.headers.get("Content-Type");
        const text = await response.text();

        if (!text) {
            console.warn(`fetchData [${url}]: Empty response body`);
            return response.status === 201 ? ({} as T) : null;
        }

        if (contentType?.includes("application/json")) {
            return JSON.parse(text) as T;
        } else if (contentType?.includes("text/plain")) {
            return text as T;
        } else if (contentType?.includes("application/pdf")) {
            const blob = new Blob([text], { type: contentType });
            return blob as T;
        } else {
            console.warn(`fetchData [${url}]: Unexpected Content-Type, returning null`);
            return null;
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
