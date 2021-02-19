import { memorizeResult } from "./Memorize";

export const capitalizeFirstLetter = memorizeResult((string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
});
