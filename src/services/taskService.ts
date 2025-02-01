import {fetchData} from "@/utils/api.ts";
import {Task, TaskUpdate} from "@/models/Task.ts";
import {accessToken} from "@/utils/token.ts";

export const getTasks = async (): Promise<Task[] | null> => {
  return await fetchData<Task[]>("tasks", "GET", accessToken);
};

export const getTasksByProjectId = async (projectId: string): Promise<Task[] | null> => {
  return await fetchData<Task[]>(`tasks/project/${projectId}`, "GET", accessToken);
};

export const updateTask = async (id: string, taskUpdate: TaskUpdate): Promise<void | null> => {
  return await fetchData<void, TaskUpdate>(`tasks/${id}`, "PUT", accessToken, taskUpdate);
};
