import { Client, IConfig } from "./Client";

export const authorisedApiClient = (token: string | undefined) =>  new Client(new IConfig(token ?? "not-logged-in"))

export const apiClient = authorisedApiClient(undefined);