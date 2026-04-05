const modules = import.meta.glob("./*.json", { eager: true });

const dictionaries = Object.values(modules).reduce((acc, mod) => {
  const data = mod.default || mod;
  if (data?.locale) {
    acc[data.locale] = data;
  }
  return acc;
}, {});

export function getAvailableLocales() {
  return Object.values(dictionaries)
    .map((dict) => ({
      locale: dict.locale,
      direction: dict.direction || "ltr",
      name: dict.meta?.name || dict.locale,
      nativeName: dict.meta?.nativeName || dict.meta?.name || dict.locale,
    }))
    .sort((a, b) => a.locale.localeCompare(b.locale));
}

export function getDictionary(language = "en") {
  return (
    dictionaries[language] ||
    dictionaries.en ||
    Object.values(dictionaries)[0] ||
    {}
  );
}

export function t(language, key, fallback = "") {
  const dict = getDictionary(language);
  const value = key.split(".").reduce((current, part) => current?.[part], dict);
  return typeof value === "string" ? value : fallback;
}

export function applyLocaleDirection(
  language = "en",
  root = document.documentElement,
) {
  if (!root) return;
  const dict = getDictionary(language);
  const dir = dict.direction || "ltr";
  const locale = dict.locale || "en";

  root.setAttribute("lang", locale);
  root.setAttribute("dir", dir);
  root.classList.toggle("rtl", dir === "rtl");
}

export { dictionaries };
