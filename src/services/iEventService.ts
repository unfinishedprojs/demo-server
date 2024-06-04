import { InviteEvent } from "@prisma/client";
import prisma from "../prisma/client";
import { DatabaseError } from "../errors/DatabaseError";

export async function createCEvent(discordId: string, token: string) {
    if (await findCEvent(discordId)) return await voteCEvent(discordId, token)
    else {
        try {
            const result = await prisma.createInviteEvent.create({
                data: {
                    discordId: discordId,
                    createVote: {
                        create: {
                            userToken: token
                        }
                    }
                },
            });

            return result;
        } catch (error) {
            throw new DatabaseError('Could not create CEvent', error as Error)
        }
    }
}

export async function findCEvent(discordId: string) {
    try {
        const result = await prisma.createInviteEvent.findUnique({
            where: {
                discordId: discordId,
            }
        })

        return result
    } catch (error) {
        throw new DatabaseError('Could not find unique discordId', error as Error)
    }
}

export async function findCVote(discordId: string, token: string) {
    try {
        const result = await prisma.createVote.findUnique({
            where: {
                discordId: discordId,
                userToken: token
            }
        })

        return result
    } catch (error) {
        throw new DatabaseError('Could not find unique CVote', error as Error)
    }
}

export async function countCVote(discordId: string) {
    try {
        const result = await prisma.createVote.count({
            where: {
                discordId: discordId
            }
        })

        return result
    } catch (error) {
        throw new DatabaseError('Could not count CVotes', error as Error)
    }
}

export async function voteCEvent(discordId: string, token: string) {
    try {
        const result = await prisma.createVote.create({
            data: {
                userToken: token,
                discordId: discordId
            }
        })

        return { discordId }
    } catch (error) {
        throw new DatabaseError('Could not vote on CEvent', error as Error)
    }
}

export async function createIEvent(eventId: string, discordId: string, invite: string, duration: number) {
    try {
        const result = await prisma.inviteEvent.create({
            data: {
                eventId: eventId,
                discordId: discordId,
                invite: invite,
                duration: duration,
                ended: false
            },
        });

        return result as InviteEvent;
    } catch (error) {
        throw new DatabaseError('Could not create IEvent', error as Error) 
    }
}

export async function deleteIEvent(eventId: string) {
    try {
        const result = await prisma.inviteEvent.delete({
            where: {
                eventId: eventId,
            },
        });

        return result as InviteEvent;
    } catch (error) {
        throw new DatabaseError('Could not delete IEvent', error as Error)
    }
}

export async function findIEvent(eventId: string) {
    try {
        const result = await prisma.inviteEvent.findUnique({
            where: {
                eventId: eventId
            },
        });

        return result as InviteEvent;
    } catch (error) {
        throw new DatabaseError('Could not find IEvent', error as Error)
    }
}

export async function findIEventById(discordId: string) {
    try {
        const result = await prisma.inviteEvent.findMany({
            where: {
                discordId: discordId
            },
        });

        return result as InviteEvent[];
    } catch (error) {
        throw new DatabaseError('Could not find unique discordId', error as Error)
    }
}

export async function iEventVotePos(eventId: string, token: string) {
    try {
        const result = await prisma.positiveVote.create({
            data: {
                userToken: token,
                iEventId: eventId
            }
        })

        return result
    } catch (error) {
        throw new DatabaseError('Could not create iEventVotePos', error as Error)
    }
}

export async function iEventVoteNeg(eventId: string, token: string) {
    try {
        const result = await prisma.negativeVote.create({
            data: {
                userToken: token,
                iEventId: eventId
            }
        })

        return result
    } catch (error) {
        throw new DatabaseError('Could not create iEventVoteNeg', error as Error)
    }
}

export async function iEventVoted(eventId: string, token: string) {
    try {
        const negative = await prisma.negativeVote.findUnique({
            where: {
                userToken: token,
                iEventId: eventId
            }
        })

        const positive = await prisma.positiveVote.findUnique({
            where: {
                userToken: token,
                iEventId: eventId
            }
        })

        if (!positive && !negative) return false
        else return true
    } catch (error) {
        throw new DatabaseError('Could not accomplish request', error as Error)
    }
}

export async function checkAndUpdateEventStatus() {
    const currentTime = new Date()

    const inviteEvents = await prisma.inviteEvent.findMany({
        where: {
            ended: false
        }
    })

    for (const event of inviteEvents) {
        const eventEndTime = new Date(event.createdAt)
        eventEndTime.setMinutes(eventEndTime.getMinutes() + event.duration)

        if (currentTime >= eventEndTime) {
            await prisma.inviteEvent.update({
                where: { eventId: event.eventId },
                data: { ended: true }
            })
        }
    }
}

export async function getAllIEvent(active: boolean) {
    try {
        const result = await prisma.inviteEvent.findMany({
            where: {
                ended: active
            },
        });

        return result as InviteEvent[];
    } catch (error) {
        throw new DatabaseError('Could not find all IEvents', error as Error)
    }
}