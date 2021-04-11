import { memorizeResult } from "./Memorize";

export const capitalizeFirstLetter = memorizeResult((string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
});

const titleMaxLength = 40;

export const getCardTitle = (title?: string) => {
  if (!title) return "Unknown";
  return title.length > titleMaxLength
    ? title.substr(0, titleMaxLength) + "..."
    : title;
};

export const addSpacesToString = (str : string) => str.replace(/([A-Z])/g, ' $1').trim()
