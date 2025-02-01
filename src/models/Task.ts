import {Project} from "@/models/Project.ts";

export interface Task {
  id: string;
  status: string;
  taskOrder: number;
  project: Project;
  modifiedDate: string;
  createdDate: string;
}

export interface TaskCreate {
  status: string;
  taskOrder: number;
  projectId: string;
}

export interface TaskUpdate {
  status?: string;
  projectId?: string;
  oldTaskOrder?: number;
  taskOrder?: number;
}
