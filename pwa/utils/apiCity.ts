import {City} from "@interfaces/City";
import {Street} from "@interfaces/Street";

export const searchCity = async (
  search: string,
  useNominatim: boolean = false
) => {
  return useNominatim ? nominatimCities(search) : gouvCities(search);
};

const nominatimCities = async (search: string) => {
  search = encodeURIComponent(search);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${search}&addressdetails=1&format=json`
  );
  return await response.json();
};

const gouvCities = async (search: string) => {
  search = encodeURIComponent(search);
  const response = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${search}&type=municipality&limit=9`
  );

  return await response.json().then((data) => {
    return data['features'];
  });
};

export const searchStreet = async (
    search: string,
    city: City|null
) => {
  search = encodeURIComponent(search);
  const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${search}&type=street&limit=15${city && '&lat='+city.lat+'&lon='+city.lon}`
  );

  const apiFeatures =  await response.json().then((data) => {
    return data['features'];
  });


  const data: Street[] = [];
  apiFeatures.map((feature: City) => {
    return data.push({
      name: feature.properties.name,
      city: feature.properties.city+' ('+feature.properties.postcode+')',
      lat: feature.geometry.coordinates[0],
      lon: feature.geometry.coordinates[1],
    });
  })

  return data;
};
