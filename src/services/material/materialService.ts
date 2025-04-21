import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { Material, SearchMaterialRequest, UpdateMaterial } from "@/models/Material";

export const getAllMaterial = async (): Promise<Material[] | null> => {
    return await fetchData<Material[]>("inventory/materials", "GET", tokenService.accessToken);
};

export const getMaterialById = async (id: number): Promise<Material | null> => {
    return await fetchData<Material>(`inventory/materials/${id}`, "GET", tokenService.accessToken);
};

export const createMaterial = async (module: Material): Promise<Material | null> => {
    return await fetchData<Material, Material>(`inventory/materials`, "POST", tokenService.accessToken, module);
};

export const updateMaterial = async (id: number, module: UpdateMaterial): Promise<void | null> => {
    return await fetchData<void, UpdateMaterial>(`inventory/materials/${id}`, "PUT", tokenService.accessToken, module);
};

export const deleteMaterial = async (id: number): Promise<void | null> => {
    return await fetchData<void>(`inventory/materials/${id}`, "DELETE", tokenService.accessToken);
};

export const searchMaterials = async (
    request: SearchMaterialRequest,
    page: number,
    size: number
): Promise<{ content: Material[]; totalPages: number } | null> => {
    return await fetchData<{ content: Material[]; totalPages: number }, SearchMaterialRequest>(
        `inventory/materials/search?page=${page}&size=${size}`,
        "POST",
        tokenService.accessToken,
        request
    );
};