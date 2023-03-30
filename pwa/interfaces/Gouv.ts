export interface City {

    geometry: Geometry;

    properties: Properties;
}

export interface Properties {

    id: string;

    city: string;

    postcode: string;
}

export interface Geometry {

    coordinates: number[];
}

