import { ClientMetadata } from "@services/api/Client";

export const buildUserInfo =
    new ClientMetadata({
      page: window.location.pathname,
      referrer: document.referrer,
      browserName: navigator.appName,
      browserEngine: navigator.product,
      browserLanguage: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
    });
