import {fetchData} from "@/utils/api.ts";

export const getProjects = async () => {
  return await fetchData("projects");
};
