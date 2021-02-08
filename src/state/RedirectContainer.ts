import { Routes } from "@typeDefinitions/Routes";
import { useState } from "react";
import { createContainer } from "unstated-next";

interface IRedirect {
  to: Routes | undefined;
}
const useRedirect = () => {
  const [redirect, setRedirect] = useState<IRedirect>({ to: undefined });

  const redirectToRoute = (route: Routes) => {
    setRedirect({ to: route });
    setTimeout(() => setRedirect({ to: undefined }), 1000);
  };

  return { redirectToRoute, redirect };
};

export const RedirectContainer = createContainer(useRedirect);
