export interface CityAddress {
  geometry: Geometry;
  properties: Properties;
}

export interface Properties {
  id: string;
  city: string;
  postcode: string;
  label: string;
  name: string;
}

export interface Geometry {
  coordinates: number[];
}

export interface City {
  code: string;
  nom: string;
  centre: {
    type: string;
    coordinates: number[];
  };
  codePostaux?: string[];
  departement: {
    code: string;
    nom: string;
  };
}
