export interface Media {
  id: string;
  type: string;
  path: string;
  modifiedDate: string;
  createdDate: string;
}

export interface MediaRequest {
  projectName?: string;
  file?: File;
  assignmentId?: string;
  isContent?: boolean;
  fileName?: string;
}
