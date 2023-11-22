import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

export const recursiveRemoveKey = (object, deleteKey) => {
  delete object[deleteKey];

  Object.values(object).forEach((val) => {
    if (typeof val !== "object") return;
    recursiveRemoveKey(val, deleteKey);
  });
};

export const dateFormat = (value, dateTpl, altStr = "---") => {
  let date_str: string | null;

  try {
    date_str = format(new Date(value), dateTpl);
  } catch (error) {
    console.log(`err: ${error}`);
    date_str = altStr;
  }

  return date_str;
};
