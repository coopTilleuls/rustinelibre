export const formatDate = (dateString: string | undefined): string => {
  if (typeof dateString === 'undefined') {
    return '';
  }

  let date = new Date(dateString);

  // convert for timezone of user
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  date = new Date(date.getTime() + userTimezoneOffset);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
