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
  codeDepartment: string;
  inseeCode: string;
  codeRegion: string;
  departmentName: string;
  name: string;
  latitude: string;
  longitude: string;
  zipCode: string;
}
