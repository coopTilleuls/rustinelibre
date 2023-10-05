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
    const response1 = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${search}&fields=code,nom,centre,departement,codesPostaux`
    );

    const response2 = await fetch(
      `https://geo.api.gouv.fr/communes_associees_deleguees?nom=${search}&fields=code,nom,centre,departement`
    );

    const data1 = await response1.json();
    const data2 = await response2.json();

    const mergedData = [...data1, ...data2];

    return mergedData;
  } catch (e) {
    return console.error(e);
  }
};

export const searchStreet = async (search: string, city: City | null) => {
  search = encodeURIComponent(search);
  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${search}&type=street&limit=15${
        city && '&lat=' + city.lat + '&lon=' + city.lon
      }`
    );
    const apiFeatures = await response.json().then((data) => {
      return data['features'];
    });

    const data: Street[] = [];
    apiFeatures.map((feature: CityAddress) => {
      return data.push({
        name: feature.properties.name,
        city: feature.properties.city + ' ' + feature.properties.postcode,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
      });
    });
    return data;
  } catch (e) {
    return [];
  }
};
