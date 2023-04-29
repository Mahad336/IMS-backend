export const formatDate = (dateString: string): string => {
  const date: Date = new Date(dateString);
  const day: string = ('0' + date.getDate()).slice(-2);
  const month: string = ('0' + (date.getMonth() + 1)).slice(-2);
  const year: number = date.getFullYear();

  return `${day}/${month}/${year}`;
};
