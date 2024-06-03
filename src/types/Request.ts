export interface RegisterReq {
    discordId: string,
    invite: string,
}

export interface iEventReq {
    discordId: string,
    invite: string,
    duration: number,
}

export interface voteReq {
    eventId: string
    token: string,
}