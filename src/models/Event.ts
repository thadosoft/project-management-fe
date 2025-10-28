import { Project } from "./Project";

export type EventType = "Demo" | "Họp" | "Khảo sát";

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  type: EventType;
  projectId?: string;
  project?: Project;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRequest {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  type: EventType;
  projectId?: string;
}
