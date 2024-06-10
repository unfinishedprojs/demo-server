export function toBase64(string: string) {
  return Buffer.from(string).toString("base64");
}

export function fromBase64(string: string) {
  return Buffer.from(string, "base64").toString("ascii");
}
