import { User } from "./User";

export interface InviteEvent {
    eventId: string,
    discordId: string,
    user: User | undefined,
    invite: string,
    ended: boolean,
    createdAt: Date,
    duration: number,
    posVotes: number,
    negVotes: number
}

export interface Vote { 
    
}