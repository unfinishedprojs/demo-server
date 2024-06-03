import crypto from 'crypto'

export function randomStringAsBase64Url(size: number) {
    return crypto.randomBytes(size).toString("base64url");
}

export function toBase64(string: string) {
    return Buffer.from(string).toString('base64')
}

export function fromBase64(string: string) {
    return Buffer.from(string, 'base64').toString('ascii')
}