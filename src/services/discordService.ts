import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { client } from "../app";
import prisma from "../prisma/client";
import { DatabaseError } from "../errors/DatabaseError";

export async function createInvite(discordId: string) {
    const invite = await client.rest.channels.createInvite('1246134229105115318', { maxUses: 1, unique: true })

    client.rest.guilds.createScheduledEvent('1245540307274170368', { name: 'Dumpster fire', description: "I will reboot roz' computer", entityType: 3, privacyLevel: 2, scheduledStartTime: '2024-06-03T23:43:00+0000'})

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