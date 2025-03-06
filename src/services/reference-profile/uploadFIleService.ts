import { ReferenceFile } from "@/models/ReferenceFile";
import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";

export const uploadFile = async (referenceProfileId: number, file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("referenceProfileId", referenceProfileId.toString());
  formData.append("file", file);

  return await fetchData<string, FormData>("reference-files/upload", "POST", tokenService.accessToken, formData);
};

export const getFilesByProfile = async (referenceProfileId: number): Promise<ReferenceFile[] | null> => {
  return await fetchData<ReferenceFile[]>(`reference-files/profile/${referenceProfileId}`, "GET", tokenService.accessToken);
};

export const downloadFile = async (fileId: number, fileName: string): Promise<void> => {
  try {
    const response = await fetchData<Blob>(`reference-files/download/${fileId}`, "GET", tokenService.accessToken, null);

    if (!response) {
      console.error("Download failed: No response");
      return;
    }

    // Tạo URL blob để tải file
    const blobUrl = window.URL.createObjectURL(response);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${fileName}`; // Đặt tên file phù hợp
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

