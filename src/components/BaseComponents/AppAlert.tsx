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
      className="mb-0"
    >
      <Alert.Heading>{alert.title}</Alert.Heading>
      {alert.message}
    </Alert>
  );
};
