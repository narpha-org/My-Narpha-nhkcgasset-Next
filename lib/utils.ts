import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
