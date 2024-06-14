import { client } from "../../app";
import { prismaV1 as prisma } from "../../prisma/client";
import { DatabaseError } from "../../errors/DatabaseError";

export async function createInvite(discordId?: string) {
  const invite = await client.rest.channels.createInvite(
    "1246134229105115318",
    { maxUses: 1, unique: true },
  );

  try {
    const result = await prisma.inviteModel.create({
      data: {
        invite: invite.code,
        discordId: discordId,
      },
    });

    return result;
  } catch (error) {
    throw new DatabaseError("Could not create Invite", error as Error);
  }
}

export async function checkForInvite(invite: string) {
  try {
    const result = await prisma.inviteModel.findUnique({
      where: {
        invite: invite,
      },
    });

    return result;
  } catch (error) {
    throw new DatabaseError("Could not find unique discordId", error as Error);
  }
}

export async function inviteInUse(invite: string) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        invite: invite,
      },
    });

    return result;
  } catch (error) {
    throw new DatabaseError("Could not find unique discordId", error as Error);
  }
}
