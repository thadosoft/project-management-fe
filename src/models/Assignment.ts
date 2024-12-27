import {User} from "@/models/User.ts";
import {Media} from "@/models/Media.ts";

export interface Assignment {
  id: number;
  title: string;
  description: string;
  status: string;
  assignmentOrder: number;
  assigner: User;
  receiver: User;
  medias: Media[];
  modifiedDate: string;
  createdDate: string;
}
