import {fetchData} from "@/utils/api.ts";
import {Task} from "@/models/Task.ts";
import {accessToken} from "@/utils/token.ts";

export const getTasks = async (): Promise<Task[]> => {
  return await fetchData<Task[]>("tasks", "GET", accessToken);
};

export const getTasksByProjectId = async (projectId: string): Promise<Task[]> => {
  return await fetchData<Task[]>(`tasks/project/${projectId}`, "GET", accessToken);
};