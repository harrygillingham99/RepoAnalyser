import { ClientMetadata } from "@services/api/Client";

function pageon() {
  return window.location.pathname;
}

function referrer() {
  return document.referrer;
}

function browserName() {
  return navigator.appName;
}

function browserEngine() {
  return navigator.product;
}

function browserLanguage() {
  return navigator.language;
}

function dataCookiesEnabled() {
  return navigator.cookieEnabled;
}

export const buildUserInfo = () => {
  return JSON.stringify(
    new ClientMetadata({
      page: pageon(),
      referrer: referrer(),
      browserName: browserName(),
      browserEngine: browserEngine(),
      browserLanguage: browserLanguage(),
      cookiesEnabled: dataCookiesEnabled(),
    })
  );
};
