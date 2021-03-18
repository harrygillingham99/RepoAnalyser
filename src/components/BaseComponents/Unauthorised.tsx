import { Routes } from "@typeDefinitions/Routes";
import React from "react";
import { ErrorScreen } from "./ErrorScreen";

export const Unauthorised = () => {
  return (
    <ErrorScreen
      message="You need to log in to view this page."
      title="Unauthorised"
      redirectSubtitle="Back to Home"
      redirectTo={Routes.Landing}
    />
  );
};
