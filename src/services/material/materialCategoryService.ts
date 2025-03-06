import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { MaterialCategory, UpdateMaterialCategory } from "@/models/MaterialCategory";

export const getAllMaterialCategory = async (): Promise<any[] | null> => {
    return await fetchData<any[]>("inventory/categories", "GET", tokenService.accessToken);
};

export const getMaterialCategoryById = async (id: number): Promise<any[] | null> => {
    return await fetchData<any[]>(`inventory/categories/${id}`, "GET", tokenService.accessToken);
};

export const createMaterialCategory = async (module: MaterialCategory): Promise<any | null> => {
    return await fetchData<any, MaterialCategory>(`inventory/categories`, "POST", tokenService.accessToken, module);
};

export const updateMaterialCategory = async (id: number, module: UpdateMaterialCategory): Promise<void | null> => {
    return await fetchData<void, UpdateMaterialCategory>(`inventory/categories/${id}`, "PUT", tokenService.accessToken, module);
};

export const deleteMaterialCategory = async (id: number): Promise<void | null> => {
    return await fetchData<void>(`inventory/categories/${id}`, "DELETE", tokenService.accessToken);
  };