import {fetchData} from "@/utils/api.ts";
import {Project, ProjectRequest} from "@/models/Project.ts";
import {accessToken} from "@/utils/token.ts";

export const getProjects = async (): Promise<Project[] | null> => {
  return await fetchData<Project[]>("projects", "GET", accessToken);
};

export const createProject = async (projectRequest: ProjectRequest): Promise<Project | null> => {
  return await fetchData<Project>(`projects`, "POST", accessToken, projectRequest);
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  return await fetchData<Project>(`projects/${id}`, "GET", accessToken);
};
