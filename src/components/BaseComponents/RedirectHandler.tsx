import { RedirectContainer } from "@state/RedirectContainer";
import { TestId } from "@tests/TestConstants";
import { Redirect } from "react-router-dom";

export const RedirectHandler = () => {
  const { redirect } = RedirectContainer.useContainer();
  return redirect.to !== undefined ? (
    <div data-testid={TestId.RedirectHandler}>
      <Redirect to={redirect.to} />
    </div>
  ) : (
    <></>
  );
};
