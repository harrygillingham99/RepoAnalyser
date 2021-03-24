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

const useAlertState = () => {
  const [alert, setAlert] = useSetState<IGlobalAlertState>({
    visible: false,
    title: "",
    message: "",
    type: AlertType.Info,
  });

  const showInfoAlert = (title: string, message: string) => {
    setAlert({
      type: AlertType.Info,
      visible: true,
      message: message,
      title: title,
    });
  };

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
  };
};

export const AlertContainer = createContainer(useAlertState);
