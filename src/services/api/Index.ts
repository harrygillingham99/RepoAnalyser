import { Client, IConfig } from "@services/api/Client";

const buildClient = (token: string | (() => string) | undefined) => {
  switch (typeof token) {
    case "function":
      return new Client(new IConfig(token()));
    case "string":
      return new Client(new IConfig(token));
    default:
      return new Client(new IConfig("not-logged-in"));
  }
};

const apiClient = buildClient(undefined);

const authorisedApiClient = (token: string | (() => string)) =>
  buildClient(token);

export { apiClient, authorisedApiClient };
