import {Street} from '@interfaces/Street';
import {CityAddress, City as Gouv} from '@interfaces/Gouv';
import {City} from '@interfaces/City';

export const searchCity = async (
  search: string,
  useNominatim: boolean = false
) => {
  return useNominatim ? nominatimCities(search) : gouvCities(search);
};

const nominatimCities = async (search: string) => {
  search = encodeURIComponent(search);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${search}&addressdetails=1&format=json`
    );
    return await response.json();
  } catch (e) {
    return [];
  }
};

const gouvCities = async (search: string) => {
  search = encodeURIComponent(search);

  try {
    const response = await fetch(
      `https://boondmanagerapp-20a6481aece0.herokuapp.com/api/cities?name=${search}`
    );

    const data = await response.json();

    return data['hydra:member'];
  } catch (e) {
    return console.error(e);
  }
};

export const searchStreet = async (search: string, city: City | null) => {
  if (city) {
    search = encodeURIComponent(`${search} ${city.name}`);
  }
  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${search}&type=street&limit=15${
        city && '&citycode=' + city.cityCode
      }`
    );
    const apiFeatures = await response.json().then((data) => {
      return data['features'];
    });

    const data: Street[] = [];
    apiFeatures.map((feature: CityAddress) => {
      return data.push({
        name: feature.properties.name,
        city: feature.properties.city,
        postcode: feature.properties.postcode,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
      });
    });
    return data;
  } catch (e) {
    return [];
  }
};
