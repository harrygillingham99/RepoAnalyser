export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://server.local:4471"
    : "https://localhost:44306";

export const appHubUrl = `${apiUrl}/app-hub`;
