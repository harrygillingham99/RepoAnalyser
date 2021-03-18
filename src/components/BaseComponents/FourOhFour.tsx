import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { ErrorScreen } from "./ErrorScreen";

export const FourOhFour = () => {
  return (
    <ErrorScreen
      message="The page you were looking for was not found."
      title="Not Found"
      redirectSubtitle="Back to Home"
      redirectTo={Routes.Landing}
    />
  );
};
