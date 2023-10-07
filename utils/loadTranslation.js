import { loadTranslations as ni18nLoadTranslations } from "ni18n";
import path from "path";
import { i18n } from "~/next.config";
import { ni18nConfig } from "~/ni18n.config";

export const namespaces = ["translation"];

export const loadTranslations = async (initialLocale, namespacesNeeded) => {
  const locales = path.resolve("./", "./public/locales");

  return await ni18nLoadTranslations(
    ni18nConfig,
    initialLocale,
    namespacesNeeded
  );
};
