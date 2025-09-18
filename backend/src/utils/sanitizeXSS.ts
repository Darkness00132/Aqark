import xss from "xss";

// Sanitize input to prevent xss attacks
export default function sanitizeXSS(input: any) {
  if (typeof input === "string") return xss(input);
  if (typeof input === "object" && input !== null) {
    const sanitized: any = Array.isArray(input) ? [] : {};
    for (const key in input) {
      sanitized[key] = sanitizeXSS(input[key]);
    }
    return sanitized;
  }
  return input;
}
