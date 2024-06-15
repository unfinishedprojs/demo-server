import { Request, Response } from "express";
import { DatabaseError } from "../../errors/DatabaseError";
import { createInvite } from "../../services/v2/inviteService";

export const createInvites = async (req: Request, res: Response) => {
  const { quantity } = req.body;

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
