import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: {
      ...(await import(`../../messages/${locale}/errors.json`)).default,
      ...(await import(`../../messages/${locale}/home.json`)).default,
      ...(await import(`../../messages/${locale}/metadata.json`)).default,
      ...(await import(`../../messages/${locale}/about.json`)).default,
      ...(await import(`../../messages/${locale}/security.json`)).default,
      ...(await import(`../../messages/${locale}/automaticTrading.json`)).default,
      ...(await import(`../../messages/${locale}/copyTrading.json`)).default,
      ...(await import(`../../messages/${locale}/crossTrading.json`)).default,
      ...(await import(`../../messages/${locale}/terms.json`)).default,
      ...(await import(`../../messages/${locale}/blog.json`)).default,
      ...(await import(`../../messages/${locale}/mails.json`)).default,
      ...(await import(`../../messages/${locale}/dashboard.json`)).default,
      ...(await import(`../../messages/${locale}/help.json`)).default,
      ...(await import(`../../messages/${locale}/aml.json`)).default,
    },
  };
});
