import {City as Gouv} from './Gouv';
import {City as Nominatim} from './Nominatim';

export interface City {
  id: string | number;
  name: string;
  postcode?: string;
  formatted_name: string;
  lat: number;
  lon: number;
}

export const createCities = (
  citiesResponse: Gouv[] | Nominatim[],
  useNominatim: boolean
): City[] => {
  return useNominatim
    ? createCitiesWithNominatimAPI(citiesResponse as Nominatim[])
    : createCitiesWithGouvAPI(citiesResponse as Gouv[]);
};

export const createCitiesWithGouvAPI = (citiesResponse: Gouv[]): City[] => {
  let cities: City[] = [];

  citiesResponse.forEach((city: Gouv) => {
    const args = [
      city.nom,
      city.code,
      city.centre?.coordinates[1],
      city.centre?.coordinates[0],
    ];

    if (!args.some((arg) => arg === undefined)) {
      cities.push({
        id: city.code,
        name: city.nom,
        postcode: city.departement.code,
        formatted_name: city.nom + ', ' + city.code + ', ' + 'France',
        lat: city.centre.coordinates[1],
        lon: city.centre.coordinates[0],
      });
    }
  });

  return cities;
};

export const createCitiesWithNominatimAPI = (
  citiesResponse: Nominatim[]
): City[] => {
  let cities: City[] = [];
  let citiesNames: string[] = [];

  citiesResponse.forEach((city: Nominatim) => {
    const args = [city.display_name, city.place_id, city.lat, city.lon];

    if (
      !args.some((arg) => arg === undefined) &&
      !citiesNames.includes(city.display_name)
    ) {
      citiesNames.push(city.display_name);
      cities.push({
        id: city.place_id,
        name: city.display_name,
        formatted_name: city.display_name,
        lat: city.lat,
        lon: city.lon,
      });
    }
  });

  return cities;
};