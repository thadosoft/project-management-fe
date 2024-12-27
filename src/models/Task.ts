import {Project} from "@/models/Project.ts";
import {Assignment} from "@/models/Assignment.ts";

export interface Task {
  id: number;
  status: string;
  taskOrder: number;
  project: Project;
  assignments: Assignment[];
  modifiedDate: string;
  createdDate: string;
}