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
  '@id': string;
  id: string;
  code_commune_INSEE: string;
  nom_commune_postal: string;
  code_postal: string;
  libelle_acheminement: string;
  ligne_5: string;
  latitude: number;
  longitude: number;
  code_commune: string;
  article: string;
  nom_commune: string;
  nom_commune_complet: string;
  nom_commune_complet_formatte: string;
  department: Departement | null;
}

export interface Departement {
  '@id': string;
  id: string;
  code_departement: string;
  nom_departement: string;
  region: Region | null;
}

export interface Region {
  '@id': string;
  id: string;
  code_region: string;
  nom_region: string;
}
