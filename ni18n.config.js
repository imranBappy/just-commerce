const supportedLngs = ["en", "bn", "ar", "fr"];

export const ni18nConfig = {
  fallbackLng: supportedLngs,
  supportedLngs,
  ns: ["translation"],
  react: {
    useSuspense: false,
  },
};
