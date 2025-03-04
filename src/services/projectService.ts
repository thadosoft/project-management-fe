import {fetchData} from "@/utils/api.ts";
import {Project, ProjectRequest} from "@/models/Project.ts";
import tokenService from "@/services/tokenService.ts";

export const getProjects = async (): Promise<Project[] | null> => {
  return await fetchData<Project[]>("projects", "GET", tokenService.accessToken);
};

export const createProject = async (projectRequest: ProjectRequest): Promise<Project | null> => {
  return await fetchData<Project>(`projects`, "POST", tokenService.accessToken, projectRequest);
};

export const deleteProject = async (projectId: string): Promise<void | null> => {
  return await fetchData<void>(`projects/${projectId}`, "DELETE", tokenService.accessToken);
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  return await fetchData<Project>(`projects/${id}`, "GET", tokenService.accessToken);
};


