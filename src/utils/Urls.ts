import { Routes } from "@typeDefinitions/Routes";
import { memorizeResult } from "./Memorize";
import { capitalizeFirstLetter } from "./Strings";

/**
 * A routing helper used to get sections of the URL path.
 * Defaults to returning the first path segment.
 * Option to remove leading slash to be used in text"
 * @param path The path to be split.
 * @param indedToReturn (Optional) Defaults to the first [0].
 * @param leadingSlash (Optional) Defaults to true
 */
export const splitPath = memorizeResult(
  (path: string, indexToReturn: number = 0, leadingSlash = true) => {
    const splitPath = path.split("/").filter((path) => path && path !== "")[
      indexToReturn
    ];

    if (splitPath === undefined) return Routes.Home;

    return leadingSlash ? `/${splitPath}` : capitalizeFirstLetter(splitPath);
  }
);
