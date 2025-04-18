import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { Material, SearchMaterialRequest, UpdateMaterial } from "@/models/Material";

// Interface for ReferenceFileV2 (based on backend ReferenceFileV2.java)
export interface ReferenceFileV2 {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
}


export const getAllMaterial = async (): Promise<any[] | null> => {
    return await fetchData<any[]>("inventory/materials", "GET", tokenService.accessToken);
};

export const getMaterialById = async (id: number): Promise<Material | null> => {
    return await fetchData<Material>(`inventory/materials/${id}`, "GET", tokenService.accessToken);
};

export const createMaterial = async (module: Material): Promise<any | null> => {
    return await fetchData<any, Material>(`inventory/materials`, "POST", tokenService.accessToken, module);
};

export const updateMaterial = async (id: number, data: UpdateMaterial): Promise<void | null> => {
    return await fetchData<void, UpdateMaterial>(`inventory/materials/${id}`, "PUT", tokenService.accessToken, data);
};

export const deleteMaterial = async (id: number): Promise<void | null> => {
    return await fetchData<void>(`inventory/materials/${id}`, "DELETE", tokenService.accessToken);
};

export const searchMaterials = async (
    request: SearchMaterialRequest,
    page: number,
    size: number
): Promise<any | null> => {
    return await fetchData<any, SearchMaterialRequest>(
        `inventory/materials/search?page=${page}&size=${size}`,
        "POST",
        tokenService.accessToken,
        request
    );
};

// Function to upload an image for a material
export const uploadMaterialImage = async (inventoryItemId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("inventoryItemId", inventoryItemId.toString());
    formData.append("file", file);

    try {
        const response = await fetch(`/api/v1/files-materials/upload`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${tokenService.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

// Function to fetch images for a material
export const getMaterialImages = async (inventoryItemId: number): Promise<ReferenceFileV2[]> => {
    const result = await fetchData<ReferenceFileV2[]>(
        `files-materials/inventory-item/${inventoryItemId}`,
        "GET",
        tokenService.accessToken
    );
    console.log("Access token:", tokenService.accessToken);
    return result || []; // Return an empty array if result is null
};