// export const BASE_API_URL = "http://localhost:8080/api/v1/";
export const BASE_API_URL = "https://headphones-political-planning-hungarian.trycloudflare.com/api/v1/";

export const fetchData = async <T, B = unknown>(
    url: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    token: string | null = null,
    body?: B,
    options?: { responseType?: 'json' | 'text' | 'blob' } // Thêm options để chỉ định responseType
): Promise<T | null> => {
    try {
        const isFormData = body instanceof FormData;
        const response = await fetch(BASE_API_URL + url, {
            method: method,
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(!isFormData && method !== "GET" ? { "Content-Type": "application/json" } : {}),
            },
            body: isFormData ? (body as FormData) : body && method !== "GET" ? JSON.stringify(body) : undefined,
        });

        console.log(`fetchData [${url}]: Status=${response.status}, Content-Type=${response.headers.get("Content-Type")}`);

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
        if (options?.responseType === 'blob') {
            const blob = await response.blob();
            console.log(`fetchData [${url}]: Blob Data, Size=${blob.size}`);
            return blob as T;
        }

        const contentType = response.headers.get("Content-Type");

        // Kiểm tra nếu body rỗng
        const text = await response.text();
        if (!text) {
            console.warn(`fetchData [${url}]: Empty response body`);
            return response.status === 201 ? {} as T : null; // Trả về {} cho 201 Created
        }

        if (contentType?.includes("application/json")) {
            try {
                const jsonData = JSON.parse(text);
                console.log(`fetchData [${url}]: JSON Data=`, JSON.stringify(jsonData, null, 2));
                return jsonData as T;
            } catch (e) {
                console.error(`fetchData [${url}]: Failed to parse JSON:`, e);
                return null;
            }
        } else if (contentType?.includes("text/plain")) {
            console.log(`fetchData [${url}]: Text Data=`, text);
            return text as T;
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