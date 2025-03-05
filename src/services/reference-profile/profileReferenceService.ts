import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { ReferenceProfileRequest } from "@/models/ProfileReference";

export const getAll = async (): Promise<any[] | null> => {
  return await fetchData<any[]>("reference-profile", "GET", tokenService.accessToken);
};

export const getById = async (profileReferenceId: number): Promise<any[] | null> => {
  return await fetchData<any[]>(`reference-profile/${profileReferenceId}`, "GET", tokenService.accessToken);
};

export const getByProfileReferenceId = async (profileReferenceId: number): Promise<any[] | null> => {
  return await fetchData<any[]>(`reference-profile/module/${profileReferenceId}`, "GET", tokenService.accessToken);
};

export const create = async (referenceProfile: ReferenceProfileRequest): Promise<any | null> => {
  return await fetchData<any, ReferenceProfileRequest>(`reference-profile`, "POST", tokenService.accessToken, referenceProfile);
};
