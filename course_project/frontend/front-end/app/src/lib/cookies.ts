// Function to set a cookie
export function setCookie(name: string, value: string, days: number): void {
    if (typeof document === 'undefined') return; // Skip if not in the browser
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to get a cookie
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null; // Skip if not in the browser
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

// Function to delete a cookie
export function deleteCookie(name: string): void {
    if (typeof document === 'undefined') return; // Skip if not in the browser
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
