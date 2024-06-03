import { InviteEvent } from "./Event"

export interface User {
    discordId: number,
    invite: string,
    InviteEvent?: InviteEvent,
    joined: Date,
}