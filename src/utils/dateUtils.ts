export const parseVNDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;

  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("/");

  // return Date in ISO-compatible format
  return new Date(`${year}-${month}-${day}T${timePart}`);
};