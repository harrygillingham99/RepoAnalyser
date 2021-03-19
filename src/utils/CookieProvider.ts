export function setCookie<T> (name: string, val: T) {
  const date = new Date();
  const value = mapToCookieValue(val)

  // Set it expire in 7 days
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; Secure; SameSite=Strict`;
};

export function getCookie<T>(name: string) : T | undefined  {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts && parts.length === 2) {
    return mapFromCookieValue(parts.pop()?.split(";").shift());
  }
};

export const expireCookie = (name: string) => {
  const date = new Date();

  // Set it expire in -1 days
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie = `${name}=; expires=${date.toUTCString()}; path=/; Secure; SameSite=Strict`;
};

function mapFromCookieValue<T>(stringVal? : string) : T | undefined {
  if(!stringVal || stringVal.length === 0) return;
  return JSON.parse(stringVal) as T
}

function mapToCookieValue<T> (value : T) :  string {
  switch(typeof(value)){
    case "object":
    case "string":
    case "number":
      return JSON.stringify(value);
    case "function":
      return mapToCookieValue(value());
    default:
      throw new Error(`Cannot map ${typeof(value)} to cookie value`)
  }
}
