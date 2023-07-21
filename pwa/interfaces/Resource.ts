export type Response = Record<string, string>;

export type RequestHeaders = Record<string, string>;

export type RequestBody = Record<
  string,
  string | number | boolean | Array<unknown> | null | undefined
>;

export type RequestParams = Record<string, string | number | boolean>;

export interface ResponseError {
  '@id': string;
  '@type': string;
  'hydra:description': string;
  'hydra:title': string;
}

export interface Collection<T> {
  '@context': string;
  '@id': string;
  '@type': 'hydra:Collection';
  'hydra:member': Array<T>;
  'hydra:totalItems': number;
  'hydra:view': {
    'hydra:first': string;
    'hydra:last': string;
    'hydra:next'?: string;
    'hydra:previous'?: string;
  };
}
