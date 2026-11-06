export interface UrlValidationResult {
  valid: boolean;
  error?: string;
  normalized?: string;
}

export const FORBIDDEN_HOST_SUFFIXES = [
  ".local",
  ".internal",
  ".onion",
  ".test",
  ".example",
  ".invalid",
  ".localhost",
];

export function validateAltCheckUrl(rawInput: string): UrlValidationResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return { valid: false, error: "url not valid" };
  }

  if (trimmed.length > 2048) {
    return { valid: false, error: "url too long" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "url not valid" };
  }

  // Scheme check
  if (parsed.protocol !== "https:") {
    return { valid: false, error: "url must use https" };
  }

  // Credentials / userinfo check
  if (parsed.username || parsed.password) {
    return { valid: false, error: "url contains credentials" };
  }

  // Port check (only 443 permitted)
  if (parsed.port && parsed.port !== "443") {
    return { valid: false, error: "url port not allowed" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Single-label hostnames or localhost
  if (!hostname.includes(".") || hostname === "localhost") {
    return { valid: false, error: "url host not allowed" };
  }

  // Forbidden suffixes
  for (const suffix of FORBIDDEN_HOST_SUFFIXES) {
    if (hostname.endsWith(suffix)) {
      return { valid: false, error: "url host not allowed" };
    }
  }

  // Trailing dot normalization check
  const hostNoDot = hostname.endsWith(".") ? hostname.slice(0, -1) : hostname;

  // IPv4 dotted check
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const ipMatch = hostNoDot.match(ipv4Regex);
  if (ipMatch) {
    return { valid: false, error: "url host not allowed" };
  }

  // IPv6 bracketed check
  if (hostNoDot.startsWith("[") && hostNoDot.endsWith("]")) {
    return { valid: false, error: "url host not allowed" };
  }
  if (hostNoDot.includes(":") && !hostNoDot.includes(".")) {
    return { valid: false, error: "url host not allowed" };
  }

  // Decimal/hex integer literal IP check
  if (/^\d+$/.test(hostNoDot) || /^0x[0-9a-f]+$/i.test(hostNoDot)) {
    return { valid: false, error: "url host not allowed" };
  }

  return {
    valid: true,
    normalized: parsed.toString(),
  };
}
