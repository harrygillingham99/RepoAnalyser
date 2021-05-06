import { ToastContent } from "@components/BaseComponents/ToastContent";
import { useToasts } from "react-toast-notifications";
import { createContainer } from "unstated-next";

const useAlertState = () => {
  const { addToast, removeAllToasts, toastStack } = useToasts();

  const showInfoAlert = (title: string, message: string) =>
    addToastIfNotExists(title, message, "info");

  const clearAlerts = () => removeAllToasts();

  const showErrorAlert = (title: string, message: string) =>
    addToastIfNotExists(title, message, "error");

  const addToastIfNotExists = (
    title: string,
    message: string,
    type: "error" | "info"
  ) =>
    toastStack.findIndex(
      (toast) => toast.id === `${title}-${message}-${type}`
    ) === -1 &&
    addToast(ToastContent(title, message), {
      appearance: type,
      id: `${title}-${message}-${type}`,
    });

  return {
    showErrorAlert,
    showInfoAlert,
    clearAlerts,
  };
};

export const AlertContainer = createContainer(useAlertState);
