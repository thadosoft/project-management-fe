import {Project} from "@/models/Project.ts";

export interface Task {
  id: string;
  status: string;
  taskOrder: number;
  project: Project;
  modifiedDate: string;
  createdDate: string;
}

export interface TaskRequest {
  status?: string;
  projectId?: string;
  taskOrder?: number;
  oldTaskOrder?: number;
}
