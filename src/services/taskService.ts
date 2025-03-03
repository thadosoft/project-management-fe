import {fetchData} from "@/utils/api.ts";
import {Task, TaskRequest} from "@/models/Task.ts";
import {accessToken} from "@/utils/token.ts";

export const getTasks = async (): Promise<Task[] | null> => {
  return await fetchData<Task[]>("tasks", "GET", accessToken);
};

export const getTasksByProjectId = async (projectId: string): Promise<Task[] | null> => {
  return await fetchData<Task[]>(`tasks/project/${projectId}`, "GET", accessToken);
};

export const createTask = async (taskRequest: TaskRequest): Promise<Task | null> => {
  return await fetchData<Task, TaskRequest>(`tasks`, "POST", accessToken, taskRequest);
};

export const updateTask = async (id: string, taskRequest: TaskRequest): Promise<void | null> => {
  return await fetchData<void, TaskRequest>(`tasks/${id}`, "PUT", accessToken, taskRequest);
};

export const deleteTask = async (id: string): Promise<void | null> => {
  return await fetchData<void>(`tasks/${id}`, "DELETE", accessToken);
};