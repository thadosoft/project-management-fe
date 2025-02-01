import {fetchData} from "@/utils/api.ts";
import {Media} from "@/models/Media.ts";
import {accessToken} from "@/utils/token.ts";

export const getMedias = async (): Promise<Media[] | null> => {
  return await fetchData<Media[]>("medias", "GET", accessToken);
};
