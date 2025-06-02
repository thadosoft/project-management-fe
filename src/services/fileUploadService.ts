import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";

export const getImageUrl = async (filePath: string): Promise<string> => {
  try {
    const url = `reference-files/images/${filePath}`;
    const blob = await fetchData<Blob, null>(
      url,
      "GET",
      tokenService.accessToken,
      null,
      { responseType: 'blob' }
    );
    if (!blob) {
      throw new Error(`Failed to fetch image: ${filePath}`);
    }
    // Chuyển Blob thành URL
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (err) {
    console.error(`Error fetching image URL for ${filePath}:`, err);
    return 'path/to/fallback-image.jpg'; // URL dự phòng
  }
};