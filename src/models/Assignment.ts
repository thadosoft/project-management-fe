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
  status_type: string;
  start_date?: string;
  end_date?: string;
}

export interface AssignmentRequest {
  title?: string;
  description?: string;
  oldAssignmentOrder?: number;
  assignmentOrder?: number;
  oldTaskId?: string;
  taskId?: string;
  assignerId?: string;
  receiverId?: string;
  status_type?: string;
  start_date?: string;
  end_date?: string;
}

