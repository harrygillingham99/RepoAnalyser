import { AlertContainer } from "@state/AlertContainer";
import React from "react";
import { Alert } from "react-bootstrap";

export const AppAlert = () => {
  const { alert, hideAlert } = AlertContainer.useContainer();
  return (
    <Alert
      show={alert.visible}
      variant={alert.type}
      onClose={() => hideAlert()}
      dismissible
      className="mt-3 mb-3"
    >
      <Alert.Heading>{alert.title}</Alert.Heading>
      {alert.message}
    </Alert>
  );
};
