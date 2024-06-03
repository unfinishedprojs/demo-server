import Logger from "js-logger";
import { prisma } from "..";
import { DbErr, intCode } from "../types/Error";
import { InviteEvent } from "../types/Event";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
        if (error instanceof PrismaClientKnownRequestError) return { model: error.meta?.modelName as string, target: error.meta?.target as Array<string>, code: error.code as unknown as intCode } as DbErr
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
        Logger.error(error);
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
        Logger.error(error);
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
        console.log(error)
        if (error instanceof PrismaClientKnownRequestError) return { model: error.meta?.modelName as string, target: error.meta?.target as Array<string>, code: error.code as unknown as intCode } as DbErr
        else console.log(error)
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
        console.log(error)
        if (error instanceof PrismaClientKnownRequestError) return { model: error.meta?.modelName as string, target: error.meta?.target as Array<string>, code: error.code as unknown as intCode } as DbErr
        else console.log(error)
    }
}

export async function iEventVoted(eventId: string, token: string) {
    try {
        const negative = await prisma.negativeVote.create({
            data: {
                userToken: token,
                iEventId: eventId
            }
        })

        const positive = await prisma.positiveVote.create({
            data: {
                userToken: token,
                iEventId: eventId
            }
        })

        if (!positive && !negative) return false
        else return true
    } catch (error) {
        console.log(error)
        if (error instanceof PrismaClientKnownRequestError) return { model: error.meta?.modelName as string, target: error.meta?.target as Array<string>, code: error.code as unknown as intCode } as DbErr
        else console.log(error)
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