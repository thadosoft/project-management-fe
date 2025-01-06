import {User} from "@/models/User.ts";

export interface Project {
  id: string;
  name: string;
  description: string;
  user: User;
  modifiedDate: string;
  createdDate: string;
}

export interface ProjectCreate {
  name: string;
  description: string;
  userId: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  userId?: string;
}
