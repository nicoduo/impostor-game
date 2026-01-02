// Cookie utility functions

export function setCookie(name: string, value: string, days: number = 7): void {
  if (!value) {
    console.warn(`Attempted to set cookie ${name} with empty value`);
    return;
  }
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = cookieString;
  console.log(`Cookie set: ${name}=${value} (encoded: ${encodeURIComponent(value)})`);
}

export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
      console.log(`Cookie retrieved: ${name}=${value}`);
      return value;
    }
  }
  console.log(`Cookie not found: ${name}`);
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function clearSessionCookies(): void {
  deleteCookie('gameCodeword');
  deleteCookie('playerName');
  deleteCookie('oldPlayerId');
}

