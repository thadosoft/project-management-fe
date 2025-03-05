import {fetchData} from "@/utils/api.ts";
import {Task, TaskRequest} from "@/models/Task.ts";
import tokenService from "@/services/tokenService.ts";

export const getTasks = async (): Promise<Task[] | null> => {
  return await fetchData<Task[]>("tasks", "GET", tokenService.accessToken);
};

export const getTasksByProjectId = async (projectId: string): Promise<Task[] | null> => {
  return await fetchData<Task[]>(`tasks/project/${projectId}`, "GET", tokenService.accessToken);
};

export const createTask = async (taskRequest: TaskRequest): Promise<Task | null> => {
  return await fetchData<Task, TaskRequest>(`tasks`, "POST", tokenService.accessToken, taskRequest);
};

export const updateTask = async (id: string, taskRequest: TaskRequest): Promise<void | null> => {
  return await fetchData<void, TaskRequest>(`tasks/${id}`, "PUT", tokenService.accessToken, taskRequest);
};

export const deleteTask = async (id: string): Promise<void | null> => {
  return await fetchData<void>(`tasks/${id}`, "DELETE", tokenService.accessToken);
};