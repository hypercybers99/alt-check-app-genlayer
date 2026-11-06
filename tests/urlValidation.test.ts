import { describe, it, expect } from "vitest";
import { validateAltCheckUrl } from "../src/lib/urlParser";

describe("URL Policy & Hostile Input Validation (Mirrors Contract)", () => {
  const hostileTable = [
    // Insecure / Non-HTTPS
    { input: "http://example.com/page.html", valid: false, error: "url must use https", desc: "Plain HTTP scheme" },
    { input: "ftp://example.com/resource", valid: false, error: "url must use https", desc: "FTP scheme" },
    { input: "javascript:alert(1)", valid: false, error: "url must use https", desc: "JavaScript pseudo-scheme" },
    
    // Credentials / Userinfo
    { input: "https://user:pass@example.com/audit", valid: false, error: "url contains credentials", desc: "User & Password in URL" },
    { input: "https://admin@example.com/audit", valid: false, error: "url contains credentials", desc: "Username only in URL" },

    // Ports
    { input: "https://example.com:8080/page", valid: false, error: "url port not allowed", desc: "Non-standard port 8080" },
    { input: "https://example.com:8443/page", valid: false, error: "url port not allowed", desc: "Non-standard port 8443" },
    { input: "https://example.com:443/page", valid: true, error: undefined, desc: "Explicit standard port 443 permitted" },

    // Localhost & Single-Label
    { input: "https://localhost/test.html", valid: false, error: "url host not allowed", desc: "Localhost hostname" },
    { input: "https://localhost:443/test.html", valid: false, error: "url host not allowed", desc: "Localhost with port 443" },
    { input: "https://intranet/dashboard", valid: false, error: "url host not allowed", desc: "Single-label intranet" },
    { input: "https://my-service/test", valid: false, error: "url host not allowed", desc: "Single-label local container" },

    // Internal & Reserved Suffixes
    { input: "https://router.local/status", valid: false, error: "url host not allowed", desc: ".local mDNS domain" },
    { input: "https://service.internal/api", valid: false, error: "url host not allowed", desc: ".internal domain" },
    { input: "https://secret.onion/page", valid: false, error: "url host not allowed", desc: ".onion Tor domain" },
    { input: "https://mytest.test/page", valid: false, error: "url host not allowed", desc: ".test reserved domain" },

    // Dotted IPv4 Literals
    { input: "https://127.0.0.1/page.html", valid: false, error: "url host not allowed", desc: "IPv4 loopback literal" },
    { input: "https://192.168.1.1/admin", valid: false, error: "url host not allowed", desc: "RFC 1918 192.168.x.x private IP" },
    { input: "https://10.0.0.1/status", valid: false, error: "url host not allowed", desc: "RFC 1918 10.x.x.x private IP" },
    { input: "https://172.16.0.1/login", valid: false, error: "url host not allowed", desc: "RFC 1918 172.16.x.x private IP" },
    { input: "https://169.254.169.254/meta-data", valid: false, error: "url host not allowed", desc: "Cloud link-local metadata IP" },
    { input: "https://8.8.8.8/dns-query", valid: false, error: "url host not allowed", desc: "Public IPv4 literal" },

    // Decimal & Hex Integer IP Representations
    { input: "https://2130706433/page", valid: false, error: "url host not allowed", desc: "Decimal integer IP representation (127.0.0.1)" },
    { input: "https://0x7f000001/page", valid: false, error: "url host not allowed", desc: "Hexadecimal integer IP representation" },

    // Length Limit (>2048 chars)
    { input: "https://example.com/" + "a".repeat(2040), valid: false, error: "url too long", desc: "Overlong URL > 2048 characters" },
    { input: "https://example.com/" + "a".repeat(2000), valid: true, error: undefined, desc: "URL within 2048 characters limit" },

    // Legitimate URLs
    { input: "https://huzyow155.github.io/alt-check-fixtures/good.html", valid: true, error: undefined, desc: "Public GitHub Pages fixture" },
    { input: "https://en.wikipedia.org/wiki/Alan_Turing", valid: true, error: undefined, desc: "Public Wikipedia HTTPS page" },
    { input: "https://example.com/test?query=param#fragment", valid: true, error: undefined, desc: "HTTPS URL with query and fragment" },
  ];

  it.each(hostileTable)("evaluates $desc correctly: input='$input'", ({ input, valid, error }) => {
    const result = validateAltCheckUrl(input);
    expect(result.valid).toBe(valid);
    if (!valid) {
      expect(result.error).toBe(error);
    }
  });
});
