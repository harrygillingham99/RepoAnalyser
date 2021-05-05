import React from "react";
import { useToasts } from "react-toast-notifications";
import { useSetState } from "react-use";
import { createContainer } from "unstated-next";

interface IGlobalAlertState {
  type: AlertType;
  visible: boolean;
  title: string;
  message: string;
}

enum AlertType {
  Info = "info",
  Error = "danger",
  Warning = "warning",
  Success = "success",
}

const toastContent = (title: string, message: string): React.ReactNode => {
  return (
    <>
      <h5>{title}</h5>
      <p>{message}</p>
    </>
  );
};

const useAlertState = () => {
  const { addToast, removeAllToasts } = useToasts();

  const [alert, setAlert] = useSetState<IGlobalAlertState>({
    visible: false,
    title: "",
    message: "",
    type: AlertType.Info,
  });

  const showInfoAlert = (title: string, message: string) => {
    addToast(toastContent(title, message), {
      appearance: "info",
    });
  };

  const clearInfoAlerts = () => removeAllToasts();

  const showErrorAlert = (title: string, message: string) =>
    setAlert({
      type: AlertType.Error,
      visible: true,
      message: message,
      title: title,
    });

  const showWarningAlert = (title: string, message: string) =>
    setAlert({
      type: AlertType.Warning,
      visible: true,
      message: message,
      title: title,
    });

  const showSuccessAlert = (title: string, message: string) =>
    setAlert({
      type: AlertType.Success,
      visible: true,
      message: message,
      title: title,
    });

  const hideAlert = () => setAlert({ visible: false, title: "", message: "" });

  return {
    alert,
    showErrorAlert,
    showInfoAlert,
    showSuccessAlert,
    showWarningAlert,
    hideAlert,
    clearInfoAlerts,
  };
};

export const AlertContainer = createContainer(useAlertState);
