import { User } from "@prisma/client";
import prisma from "../prisma/client";
import { toBase64 } from "./generateService";
import { DatabaseError } from "../errors/DatabaseError";

export async function createToken(
  discordId: string,
  invite: string,
  inviteEventID?: string,
) {
  try {
    const result = await prisma.user.create({
      data: {
        discordId: discordId,
        invite: invite,
        token: `${toBase64(discordId)}.${toBase64(invite)}.${(Math.random() * 10).toString(36).replace(".", "")}`,
        iEventId: inviteEventID || undefined,
      },
    });

    return result as User;
  } catch (error) {
    throw new DatabaseError("Could not create user", error as Error);
  }
}

export async function checkForToken(
  discordId: string | undefined,
  token: string | undefined,
) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        discordId: discordId,
        token: token,
      },
    });

    return result as User;
  } catch (error) {
    throw new DatabaseError("Could not find unique token", error as Error);
  }
}
