import { RedirectContainer } from "@state/RedirectContainer";
import { Redirect } from "react-router-dom";

export const RedirectHandler = () => {
  const { redirect } = RedirectContainer.useContainer();
  return redirect.to !== undefined ? <Redirect to={redirect.to} /> : <></>;
};
