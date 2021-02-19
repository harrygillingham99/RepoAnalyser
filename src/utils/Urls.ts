import { capitalizeFirstLetter } from "./Strings";

export const splitPath = (
  path: string,
  indexToReturn: number = 0,
  leadingSlash = true
): string | undefined => {
  const splitPath = path.split("/").filter((path) => path && path !== "")[
    indexToReturn
  ];

  if (splitPath === undefined) return;

  return leadingSlash ? `/${splitPath}` : capitalizeFirstLetter(splitPath);
};
