import { client } from "../../app";
import { prisma } from "../../prisma/client";
import { BaseError, DatabaseError } from "../../errors/DatabaseError";
import { hexToDecimals } from "./generateService";

export async function createCustomRole(discordId: string, roleName: string, roleColour: string) {
    const role = await client.rest.guilds.createRole('1245478730625974414', { color: hexToDecimals(roleColour), name: roleName });

    try {
        giveCustomRole(discordId, role.id);

        const result = await prisma.customRole.create({
            data: {
                discordId: discordId,
                roleId: role.id,
                roleName: roleName,
                roleColour: roleColour
            },
        });

        return result;
    } catch (error) {
        throw new DatabaseError("Could not create Custom Role", error as Error);
    }
}

export async function getCustomRole(roleId: string | undefined, discordId: string | undefined) {
    try {
        const result = await prisma.customRole.findUnique({
            where: {
                roleId: roleId,
                discordId: discordId
            }
        });

        return result;
    } catch (error) {
        throw new DatabaseError("Could not find Custom Role", error as Error);
    }
}

export async function editCustomRole(discordId: string, roleName: string, roleColour: string, roleId: string, createdAt: Date, editedAt: Date) {
    const now = new Date();

    if ((now.getTime()) - (editedAt.getTime()) >= (15 * 60 * 1000)) {
        const role = await client.rest.guilds.editRole('1245478730625974414', roleId, {
            color: hexToDecimals(roleColour),
            name: roleName
        });

        const result = await prisma.customRole.update({
            where: {
                roleId: roleId,
            },
            data: {
                roleColour: roleColour,
                roleName: roleName,
                editedAt: now
            }
        });

        return result;
    } else {
        throw new BaseError("You have already tried editing your role in the past 15 minutes");
    }
};

export async function giveCustomRole(discordId: string, roleId: string) {
    try {
        await client.rest.guilds.addMemberRole('1245478730625974414', discordId, roleId);
    } catch (error) {
        throw new Error("Could not add Custom Role to user");
    }


}