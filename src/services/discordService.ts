import { client } from "../app";
import prisma from "../prisma/client";
import { DatabaseError } from "../errors/DatabaseError";

export async function createInvite(discordId: string) {
    const invite = await client.rest.channels.createInvite('1246134229105115318', { maxUses: 1, unique: true })

    try {
        const result = await prisma.inviteModel.create({
            data: {
                invite: invite.code,
                discordId: discordId
            }
        })

        return result
    } catch (error) {
        throw new DatabaseError('Could not create Invite', error as Error)
    }
}