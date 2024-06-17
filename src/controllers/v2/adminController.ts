import { Request, Response } from "express";
import { DatabaseError } from "../../errors/DatabaseError";
import { createInvite } from "../../services/v2/inviteService";
import { countCVote } from "../../services/v2/iEventService";
import { prisma } from "../../prisma/client";

export const createInvites = async (req: Request, res: Response) => {
  const { quantity } = req.body;

  try {
    const invites: string[] = [];

    for (let index = 0; index < Number(quantity); index++) {
      const invite = await createInvite();

      invites.push(`https://demo.samu.lol/#/register?invite=${invite.invite}`);
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

export const getSuggestionCount = async (req: Request, res: Response) => {
  try {
    const { discordId } = req.body;

    console.log(discordId);

    const suggestions = await countCVote(discordId);

    console.log(suggestions);

    res.status(201).json({ suggestions });
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

export const deleteEvent = async (req: Request, res: Response) => {
  const { eventId } = req.body;

  try {
    const result1 = await prisma.positiveVote.deleteMany({ where: { iEventId: eventId } });

    const result2 = await prisma.negativeVote.deleteMany({ where: { iEventId: eventId } });

    const result = await prisma.inviteEvent.delete({ where: { eventId: eventId } });

    console.log(result);

    console.log(result1);

    console.log(result2);

    res.send(result);
  } catch (error) {
    console.log(error);
    if (error instanceof DatabaseError) {
      console.error("Database error occurred:", error.cause);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};