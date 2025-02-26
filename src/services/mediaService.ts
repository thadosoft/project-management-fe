import {fetchData} from "@/utils/api.ts";
import {Media, MediaRequest} from "@/models/Media.ts";
import {accessToken} from "@/utils/token.ts";


export const getMedias = async (): Promise<Media[] | null> => {
  return await fetchData<Media[]>("medias", "GET", accessToken);
};

export const getAttachFileNames = async (mediaRequest: MediaRequest): Promise<string[] | null> => {
  return await fetchData<string[]>(`medias/attachments`, "POST", accessToken, mediaRequest);
};

export const download = async (mediaRequest: MediaRequest): Promise<Blob | null> => {
  return await fetchData<Blob>(`medias/download`, "POST", accessToken, mediaRequest);
};

export const getUploadedDate = async (fileName: string): Promise<Date | null> => {
  return await fetchData<Date>(`medias/uploaded-date?fileName=${fileName}`, "GET", accessToken);
};

export const upload = async (file: File, assignmentId: string, projectName: string, isContent: boolean): Promise<{ url: string } | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("assignmentId", assignmentId);
  formData.append("projectName", projectName);
  formData.append("isContent", isContent.toString());

  return await fetchData<{ url: string }>("medias", "POST", accessToken, formData);
};

export const deleteByFileName = async (mediaRequest: MediaRequest): Promise<void | null> => {
  return await fetchData<void>(`medias`, "DELETE", accessToken, mediaRequest);
};

