import {User} from "@/models/User.ts";

export interface Project {
  id: number;
  name: string;
  description: string;
  user: User;
  modifiedDate: string;
  createdDate: string;
}
