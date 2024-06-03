export interface RegisterReq {
    discordId: string,
    invite: string,
}

export interface iEventReq {
    duration?: number;
    discordId: string,
    token: string,
}

export interface voteReq {
    eventId: string
    token: string,
}