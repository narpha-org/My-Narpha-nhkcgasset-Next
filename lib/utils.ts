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
  if (!object || typeof object !== "object") return;

  delete object[deleteKey];

  Object.values(object).forEach((val) => {
    if (!val || typeof val !== "object") return;
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

export const isPastDate = (value) => {
  let flg: boolean = true;

  try {
    const tgtDate = format(new Date(value), "yyyyMMddHHii");
    if (!tgtDate) {
      return flg;
    }
    const curDate = format(new Date(), "yyyyMMddHHii");
    if (tgtDate > curDate) {
      flg = false;
    }
  } catch (error) {
    console.log(`err: ${error}`);
  }

  return flg;
};
