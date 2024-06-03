import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { client, prisma } from "..";
import { intCode, DbErr } from "../types/Error";

export async function createInvite(discordId: string) {
    const invite = await client.rest.channels.createInvite('1233066792637956099', { maxUses: 1, unique: true })

    try {
        const result = await prisma.inviteModel.create({
            data: {
                invite: invite.code,
                discordId: discordId
            }
        })

        return result
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError) return { model: error.meta?.modelName as string, target: error.meta?.target as Array<string>, code: error.code as unknown as intCode, error: error } as DbErr
    }
}