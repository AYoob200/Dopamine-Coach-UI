import { getDictionary, applyLocaleDirection } from "./index";

export const ar = getDictionary("ar");

export function applyArabicRTL(root = document.documentElement) {
  applyLocaleDirection("ar", root);
}

export function resetDirection(root = document.documentElement) {
  applyLocaleDirection("en", root);
}
