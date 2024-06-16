import { client } from "../../app";

export function toBase64(string: string) {
  return Buffer.from(string).toString("base64");
}

export function fromBase64(string: string) {
  return Buffer.from(string, "base64").toString("ascii");
}

export async function getDiscordData(id: string) {
  return await client.rest.users.get(id);
}

export function formatDateInTimeZone(date: Date, timeZone: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    ...(options || {}),
  }).format(date);
}