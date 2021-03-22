import * as SignalR from "@microsoft/signalr";

export const buildStartSignalR = () => {
  const connection = new SignalR.HubConnectionBuilder()
    .withUrl(
      process.env.NODE_ENV === "production"
        ? "https://server.local:4471/app-hub"
        : "https://localhost:44306/app-hub"
    )
    .withAutomaticReconnect()
    .build();

  // Starts the SignalR connection
  connection.start().then(() => {
    // Once started, invokes the sendConnectionId in our ChatHub inside our ASP.NET Core application.
    if (connection.connectionId) {
    }
  });

  return connection;
};
