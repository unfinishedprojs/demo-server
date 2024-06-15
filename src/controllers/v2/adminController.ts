import { Request, Response } from "express";
import { checkForToken } from "../../services/v2/userService";
import { DatabaseError } from "../../errors/DatabaseError";
import { createInvite } from "../../services/v2/inviteService";

export const createInvites = async (req: Request, res: Response) => {
  const { token, quantity } = req.body;

  if (!token) {
    return res.status(400).json({ error: "No token defined" });
  }

  const user = await checkForToken(undefined, token);

  if (!user) {
    return res.status(404).json({ error: "Admin Token doesnt exist" });
  }

  if (!user.admin) {
    return res.status(409).json({ error: "Not an Admin Token" });
  }

  try {
    const invites: string[] = [];

    for (let index = 0; index < Number(quantity); index++) {
      const invite = await createInvite();

      invites.push(invite.invite);
    }

    res.status(201).json({ invites });
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
