import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr", "es", "ph", "hi", "hu", "cn", "cz", "jp", "id", "nl", "de", "it", "pt", "ro", "pl", "ar", "tr", "sk"] as const;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en",
});
