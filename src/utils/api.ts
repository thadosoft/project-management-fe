const BASE_API_URL = "http://localhost:8080/";

export const fetchData = async (url: string) => {
  try {
    const response = await fetch(BASE_API_URL + url);
    if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
