export const capitalizeFirstLetter = (
  city: string,
  postCode: string | undefined
) => {
  const formattedCity = city
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');
  return `${formattedCity} (${postCode})`;
};
