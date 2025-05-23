import tokenService from "@/services/tokenService.ts";
import { ReferenceFile } from "@/models/Material";
import { fetchData } from "@/utils/api.ts";

export const uploadMaterialImage = async (
    file: File,
    inventoryItemId: number
): Promise<ReferenceFile | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("inventoryItemId", inventoryItemId.toString());

    const result = await fetchData<ReferenceFile, FormData>(
        "file-uploads/images/upload",
        "POST",
        tokenService.accessToken,
        formData
    );
    return result;
};

export const uploadMultipleMaterialImages = async (
    files: File[],
    inventoryItemId: number
): Promise<ReferenceFile[] | null> => {
    const formData = new FormData();
    
    // Append each file to the form data
    files.forEach(file => {
        formData.append("files", file);
    });
    
    formData.append("inventoryItemId", inventoryItemId.toString());
    const result = await fetchData<ReferenceFile[], FormData>(
        "file-uploads/images/upload",
        "POST",
        tokenService.accessToken,
        formData
    );
    return result;
};

// Thêm hàm getImage để tải ảnh dưới dạng Blob
export const getImage = async (filename: string): Promise<Blob> => {
    const url = `file-uploads/images/${filename}`;
    const response = await fetchData<Blob, null>(
        url,
        "GET",
        tokenService.accessToken,
        null,
        { responseType: 'blob' } // Đảm bảo phản hồi là Blob
    );
    if (!response) {
        throw new Error(`Failed to fetch image: ${filename}`);
    }
    return response;
};