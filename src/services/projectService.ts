import {fetchData} from "@/utils/api.ts";
import {Project} from "@/models/Project.ts";
import {accessToken} from "@/utils/token.ts";

export const getProjects = async (): Promise<Project[]> => {
  return await fetchData<Project[]>("projects", "GET", accessToken);
};

export const getProjectById = async (id: string): Promise<Project> => {
  return await fetchData<Project>(`projects/${id}`, "GET", accessToken);
};
