import { fetchData } from "@/utils/api.ts";
import { accessToken } from "@/utils/token.ts";
import { ReferenceLinkRequest } from "@/models/ProfileReference";

export const createReferenceProfileLink = async (referenceProfile: ReferenceLinkRequest): Promise<any | null> => {
  return await fetchData<any, ReferenceLinkRequest>(`reference-links`, "POST", accessToken, referenceProfile);
};
