export const parseVNDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;

  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("/");

  // return Date in ISO-compatible format
  return new Date(`${year}-${month}-${day}T${timePart}`);
};

export const parseDatetoISO = (dateStr: string) => {
  if (!dateStr) return null;
  const [day, month, yearAndTime] = dateStr.split("/");
  const [year, time] = yearAndTime.split(" ");
  return `${year}-${month}-${day}T${time}`; // "2025-10-13T10:30:00"
};