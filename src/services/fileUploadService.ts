export const getImageUrl = (filePath: string): string => {
  return `http://localhost:8080/api/v1/reference-files/images/${(filePath)}`;
};
