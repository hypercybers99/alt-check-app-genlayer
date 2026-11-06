export interface RevertExplanation {
  title: string;
  explanation: string;
  action: string;
}

export const REVERT_MAP: Record<string, RevertExplanation> = {
  "url must use https": {
    title: "Insecure Protocol Rejected",
    explanation: "The contract URL policy strictly requires the https:// scheme. Plain http://, ftp://, or custom protocols are not permitted.",
    action: "Enter an https:// URL.",
  },
  "url host not allowed": {
    title: "Host Address Forbidden",
    explanation: "The contract forbids localhost, single-label names, internal network domains (.local, .internal, .onion, .test), and all IPv4/IPv6 literal IP addresses.",
    action: "Use a public registered domain name with a valid TLD.",
  },
  "url contains credentials": {
    title: "Userinfo / Credentials Forbidden",
    explanation: "URLs containing embedded usernames or passwords (e.g. user:pass@host) are rejected by protocol policy.",
    action: "Remove authentication credentials from the URL.",
  },
  "url port not allowed": {
    title: "Non-Standard Port Forbidden",
    explanation: "AltCheck only permits connection to the standard HTTPS port (443). Non-standard ports (e.g. :8080, :3000) are forbidden.",
    action: "Remove the custom port or ensure the service operates on default HTTPS port 443.",
  },
  "url too long": {
    title: "URL Length Limit Exceeded",
    explanation: "The URL exceeds the maximum allowed length of 2,048 characters.",
    action: "Shorten the URL path or query parameters to 2,048 characters or fewer.",
  },
  "url not valid": {
    title: "Malformed URL",
    explanation: "The provided string cannot be parsed as a valid WHATWG URL structure.",
    action: "Double check the URL formatting.",
  },
  "invalid label length": {
    title: "Invalid Page Label Length",
    explanation: "Page labels must be between 3 and 80 characters long.",
    action: "Provide a descriptive label between 3 and 80 characters.",
  },
  "page already registered": {
    title: "Duplicate Registration",
    explanation: "This URL has already been registered by your account. Each account can only register a given URL once.",
    action: "View the existing registered page on the dashboard or use a different URL.",
  },
  "page not found": {
    title: "Page Not Found",
    explanation: "The requested 12-hex page identifier does not exist in the contract state ledger.",
    action: "Verify the page ID or register the page first.",
  },
  "page is retired": {
    title: "Page Is Retired",
    explanation: "The page has been retired by its registrant and cannot undergo further audits or modifications.",
    action: "Select an active page.",
  },
  "audit cooldown active": {
    title: "Audit Cooldown Active",
    explanation: "Audits must be spaced by at least 300 seconds (5 minutes) per page ID to allow CDN cache invalidation.",
    action: "Wait for the 5-minute cooldown timer to expire before re-auditing.",
  },
  "maximum audits reached": {
    title: "Maximum Audits Reached",
    explanation: "The page has reached the maximum cap of 12 audits per registered URL.",
    action: "Register a new page entry if additional historical tracking is required.",
  },
  "only the registrant can do this": {
    title: "Registrant Authorization Required",
    explanation: "This action (such as adding maintainer notes or retiring the page) is restricted strictly to the address that registered the page.",
    action: "Switch to the registrant account in your wallet.",
  },
  "note length out of range": {
    title: "Note Length Out of Range",
    explanation: "Maintainer notes must be between 5 and 500 characters in length.",
    action: "Adjust your note text to be between 5 and 500 characters.",
  },
  "note limit reached for this audit": {
    title: "Audit Note Limit Reached",
    explanation: "Each audit can store at most 5 maintainer notes.",
    action: "Run a new audit to attach further progress notes.",
  },
  "audit not found": {
    title: "Audit Number Not Found",
    explanation: "The targeted audit index does not exist for this page ID.",
    action: "Specify a valid audit number from the page history.",
  },
  "not an html page": {
    title: "Target Is Not An HTML Page",
    explanation: "Consensus nodes fetched the URL but the server did not return HTML MIME (text/html) or the body lacks valid HTML markers.",
    action: "Verify the URL returns server-rendered HTML rather than JSON, plain text, or binary data.",
  },
  "fetch failed": {
    title: "Web Fetch Failed",
    explanation: "Consensus validator nodes could not reach the target URL or the server timed out.",
    action: "Check that the server is online and publicly reachable via HTTPS.",
  },
  "model output invalid": {
    title: "Model Output Validation Failed",
    explanation: "The language model consensus layer produced non-conforming evaluation output.",
    action: "Retry the audit transaction.",
  },
  "invalid pagination": {
    title: "Pagination Range Invalid",
    explanation: "View query parameters out of bounds (offset must be >= 0, limit between 1 and 50).",
    action: "Adjust pagination offset and limit.",
  },
  "clock unavailable": {
    title: "Chain Clock Unavailable",
    explanation: "Validator consensus could not read raw message datetime from block header.",
    action: "Retry the transaction.",
  },
  "empty datetime": {
    title: "Empty Datetime String",
    explanation: "Chain clock timestamp string is empty.",
    action: "Retry the transaction.",
  },
  "datetime must be string": {
    title: "Invalid Datetime Type",
    explanation: "Chain clock timestamp is not formatted as a string.",
    action: "Retry the transaction.",
  },
  "invalid ISO-8601 datetime format": {
    title: "Invalid Datetime Format",
    explanation: "Chain clock timestamp does not match ISO-8601 standard format.",
    action: "Retry the transaction.",
  },
};

export function getRevertExplanation(rawError: string): RevertExplanation {
  const normalized = rawError.trim();
  for (const [key, explanation] of Object.entries(REVERT_MAP)) {
    if (normalized.includes(key)) {
      return explanation;
    }
  }

  return {
    title: "Transaction Reverted",
    explanation: `The intelligent contract rejected the operation: "${normalized}"`,
    action: "Review transaction inputs and state prerequisites before retrying.",
  };
}
