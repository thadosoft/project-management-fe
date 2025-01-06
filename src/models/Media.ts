export interface Media {
  id: string;
  type: string;
  path: string;
  modifiedDate: string;
  createdDate: string;
}

export interface MediaCreate {
  type: string;
  path: string;
  assignmentId: number;
}

export interface MediaUpdate {
  type?: string;
  path?: string;
  assignmentId?: number;
}
