import { User } from "@prisma/client";
import { prisma } from "..";
import { toBase64 } from "./generators";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { intCode, DbErr } from "../types/Error";

export async function createToken(discordId: string, invite: string, inviteEventID?: string) {
    try {
        const result = await prisma.user.create({
            data: {
                discordId: discordId,
                invite: invite,
                token: `${toBase64(discordId)}.${toBase64(invite)}.${(Math.random() * 10).toString(36).replace('.', '')}`,
                iEventId: inviteEventID || undefined
            },
        });

        return result as User;
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError) return { model: error.meta?.modelName as string, target: error.meta as unknown as Array<string>, code: error.code as unknown as intCode, error: error } as DbErr
    }
}

export async function checkForToken(discordId: string) {
    try {
        const result = await prisma.user.findUnique({
            where: {
                discordId: discordId
            }
        })

        return result
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError) return { model: error.meta?.modelName as string, target: error.meta?.target as Array<string>, code: error.code as unknown as intCode } as DbErr
    }
}

export async function verifyToken(token: string) {
    try {
        const result = await prisma.user.findUnique({
            where: {
                token: token
            }
        })

        return result
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError) return { model: error.meta?.modelName as string, target: error.meta?.target as Array<string>, code: error.code as unknown as intCode } as DbErr
    }
}