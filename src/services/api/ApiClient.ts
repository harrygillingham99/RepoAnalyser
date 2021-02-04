import { ClientMetadata } from "./Client";

export class IConfig {
  /* 
      ApiClient.ts
      This is the base classes for the NSwag generated ApiClient. Has overrides for transformOptions and getBaseUrl to allow me to instantiate a client and
      inject firebase authorization tokens into the request header for the back end to then verify and get my own baseUrl stored in a config file.
      A comment at the top of this file will actually break client generation and for whatever reason this will end up at the bottom of Client.ts not the top.
    */
  constructor(token: string, metadata: ClientMetadata) {
    this.JwtToken = token;
    this.Metadata = metadata;
  }
  /*
      Returns a valid value for the Authorization header.
      Used to dynamically inject the current auth header.
     */
  JwtToken: string;
  Metadata: ClientMetadata;
}

class AuthorizedApiBase {
  private readonly config: IConfig;

  protected constructor(config: IConfig) {
    this.config = config;
  }

  protected transformOptions = (options: RequestInit): Promise<RequestInit> => {
    options.headers = {
      ...options.headers,
      Authorization: this.config.JwtToken,
    };
    return Promise.resolve(options);
  };

  protected getBaseUrl = (defaultUrl: string, baseUrl?: string) => {
    const ApiUrl =
      process.env.NODE_ENV === "production" ? "https://192.168.0.69:4471"
  : "https://localhost:44306";
    return ApiUrl !== undefined ? ApiUrl : defaultUrl;
  };
}
