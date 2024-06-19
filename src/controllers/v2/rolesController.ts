import { Request, Response } from "express";
import { createCustomRole, editCustomRole, getCustomRole, giveCustomRole } from "../../services/v2/rolesService";
import { BaseError, DatabaseError } from "../../errors/DatabaseError";

export const getRole = async (req: Request, res: Response) => {
    try {
        const role = await getCustomRole(undefined, req.body.id);

        console.log(role);

        return res.status(200).json({
            roleColor: role?.roleColour,
            roleName: role?.roleName,
            roleId: role?.roleId,
            discordId: role?.discordId,
            createdAt: role?.createdAt,
            editedAt: role?.editedAt
        });
    } catch (error) {
        if (error instanceof DatabaseError) {
            console.error("Database error occurred:", error.cause);
            res.status(500).json({ error: error.message });
        } else {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};

export const createRole = async (req: Request, res: Response) => {
    let { roleColour, roleName, id } = req.body;

    roleColour = roleColour.replace('#', '');

    try {
        let exists = await getCustomRole(undefined, id);

        if (await getCustomRole(undefined, id)) {
            const role = await editCustomRole(id, roleName, roleColour, exists?.roleId as string, exists?.createdAt as Date, exists?.editedAt as Date);

            return res.status(200).json({
                roleColour: role?.roleColour,
                roleName: role?.roleName,
                roleId: role?.roleId,
                discordId: role?.discordId,
                createdAt: role?.createdAt,
                editedAt: role?.editedAt
            });
        } else {
            const role = await createCustomRole(req.body.id, roleName, roleColour);

            return res.status(200).json({
                roleColour: role.roleColour,
                roleName: role.roleName,
                roleId: role.roleId,
                discordId: role.discordId,
                createdAt: role.createdAt,
                editedAt: role.editedAt
            });
        }
    } catch (error) {
        if (error instanceof DatabaseError) {
            console.error("Database error occurred:", error.cause);
            res.status(500).json({ error: error.message });
        } else if (error instanceof BaseError) {
            res.status(500).json({ error: error.message });
        } else {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};