import {User} from "@/models/User.ts";
import {Media} from "@/models/Media.ts";
import {Task} from "@/models/Task.ts";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  status: string;
  assignmentOrder: number;
  task: Task;
  assigner: User;
  receiver: User;
  medias: Media[];
  modifiedDate: string;
  createdDate: string;
}

export interface AssignmentCreate {
  title: string;
  description: string;
  status: string;
  assignmentOrder: number;
  taskId: string;
  assignerId: string;
  receiverId: string;
}

export interface AssignmentUpdate {
  title?: string;
  description?: string;
  status?: string;
  oldAssignmentOrder?: number;
  assignmentOrder?: number;
  oldTaskId?: string;
  taskId?: string;
  assignerId?: string;
  receiverId?: string;
}

