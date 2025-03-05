import { fetchData } from "@/utils/api.ts";
import { accessToken } from "@/utils/token.ts";
import { ModuleModel } from "@/models/Module";
import { UpdateModule } from "@/models/Module";
import tokenService from "@/services/tokenService.ts";

export const getAll = async (): Promise<any[] | null> => {
  return await fetchData<any[]>("modules", "GET", tokenService.accessToken);
};

export const getById = async (moduleId: number): Promise<any[] | null> => {
  return await fetchData<any[]>(`modules/${moduleId}`, "GET", tokenService.accessToken);
};

export const create = async (module: ModuleModel): Promise<any | null> => {
  return await fetchData<any, ModuleModel>(`modules`, "POST", accessToken, module);
};

export const update = async (id: number, module: UpdateModule): Promise<void | null> => {
  return await fetchData<void, UpdateModule>(`modules/${id}`, "PUT", tokenService.accessToken, module);
};
