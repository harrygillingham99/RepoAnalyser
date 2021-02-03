import { Client, IConfig } from "@services/api/Client";
import { buildUserInfo } from "@utils/userInfo";

const buildClient = (token: string | (() => string) | undefined) => {
  const metadata = buildUserInfo();
  switch (typeof token) {
    case "function":
      return new Client(new IConfig(token(), metadata));
    case "string":
      return new Client(new IConfig(token, metadata));
    default:
      return new Client(new IConfig("not-logged-in", metadata));
  }
};

const apiClient = buildClient(undefined);

const authorisedApiClient = (token: string | (() => string)) =>
  buildClient(token);

export { apiClient, authorisedApiClient };
