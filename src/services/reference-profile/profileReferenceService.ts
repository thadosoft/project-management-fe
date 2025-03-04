import { fetchData } from "@/utils/api.ts";
import { accessToken } from "@/utils/token.ts";
import { ReferenceProfileRequest } from "@/models/ProfileReference";

export const getAll = async (): Promise<any[] | null> => {
  return await fetchData<any[]>("reference-profile", "GET", accessToken);
};

export const getById = async (profileReferenceId: number): Promise<any[] | null> => {
  return await fetchData<any[]>(`reference-profile/${profileReferenceId}`, "GET", accessToken);
};

export const getByProfileReferenceId = async (profileReferenceId: number): Promise<any[] | null> => {
  return await fetchData<any[]>(`reference-profile/module/${profileReferenceId}`, "GET", accessToken);
};

export const create = async (referenceProfile: ReferenceProfileRequest): Promise<any | null> => {
  return await fetchData<any, ReferenceProfileRequest>(`reference-profile`, "POST", accessToken, referenceProfile);
};
