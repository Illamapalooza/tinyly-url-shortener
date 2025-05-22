/**
 * Validates if a string is a proper URL
 * @param url URL string to validate
 * @returns True if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);

    const urlPattern =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
    return urlPattern.test(url);
  } catch (err) {
    return false;
  }
}
