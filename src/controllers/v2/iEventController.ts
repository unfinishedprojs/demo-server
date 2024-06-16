import { Request, Response } from "express";
import {
  countCVote,
  createIEvent,
  findCVote,
  createCEvent,
  iEventVoted,
  iEventVotePos,
  iEventVoteNeg,
  getAllIEvent,
  deleteCEvent,
  findIEvent,
} from "../../services/v2/iEventService";
import { DatabaseError } from "../../errors/DatabaseError";
import { createInvite } from "../../services/v2/inviteService";
import { ApiResponse, EventRes } from "../../models/interfaces";

export const suggest = async (req: Request, res: Response) => {
  try {
    const { discordId } = req.body;

    if (!discordId) {
      return res.status(400).json({ error: "DiscordId missing" });
    }

    if (typeof discordId !== "string") {
      return res.status(401).json({ error: "DiscordId not a string" });
    }

    if (((await countCVote(discordId)) as number + 1) >= 2) {
      await deleteCEvent(discordId);
      const invite = await createInvite(discordId);
      const result = await createIEvent(
        (Math.random() * 10).toString(36).replace(".", ""),
        discordId,
        invite.invite,
        Number(process.env.IDURATION)
      );

      return res.status(200).json({
        status: 200,
        response: {
          eventId: result.eventId,
          discordId: result.discordId,
          createdAt: result.createdAt,
          endsAt: result.endsAt,
          duration: result.duration,
          ended: result.ended,
        } as EventRes,
      } as ApiResponse);
    }

    if ((await findCVote(discordId, req.body.password))?.createdAt) {
      return res.status(406).json({ error: "Vote already cast. Ignored" });
    }

    const result = await createCEvent(discordId, req.body.password);
    return res.status(200).json({
      discordId: result.discordId,
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

export const votePositive = async (req: Request, res: Response) => {
  try {
    const { eventId, password } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "eventId missing" });
    }

    if (typeof eventId !== "string") {
      return res.status(401).json({ error: "eventId not a string" });
    }

    if ((await iEventVoted(eventId, password)) === true) {
      return res.status(406).json({ error: "Vote already cast. Ignored" });
    }

    const result = await iEventVotePos(eventId, password);

    res.status(200).json({
      iEventId: result.iEventId,
      createdAt: result.createdAt,
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

export const voteNegative = async (req: Request, res: Response) => {
  try {
    const { eventId, password } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "eventId missing" });
    }

    if (typeof eventId !== "string") {
      return res.status(401).json({ error: "EventId not a string" });
    }

    if ((await iEventVoted(eventId, password)) === true) {
      return res.status(406).json({ error: "Vote already cast. Ignored" });
    }

    const result = await iEventVoteNeg(eventId, password);

    res.status(200).json({
      iEventId: result.iEventId,
      createdAt: result.createdAt,
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

export const getIEvents = async (req: Request, res: Response) => {
  try {
    const { active } = req.query;

    let isActive: boolean | undefined = /^true$/i.test(active as string);

    if (!active) isActive = undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = await getAllIEvent(isActive as boolean | undefined);

    result = result.map((item: { [x: string]: unknown; invite: unknown; }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { invite, ...rest } = item;
      return rest;
    });

    return res.status(200).json({ events: result });
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

export const getIEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: "EventID missing" });
    }

    if (typeof eventId !== "string") {
      return res.status(401).json({ error: "EventID not a string" });
    }

    const result = await findIEvent(eventId as string);

    return res.status(200).json({
      eventId: result.eventId,
      discordId: result.discordId,
      discordUser: result.discordUser,
      discordPfpUrl: result.discordPfpUrl,
      discordSlug: result.discordSlug,
      ended: result.ended,
      createdAt: result.createdAt,
      endsAt: result.endsAt,
      positiveVotesInt: result.positiveVotesInt,
      negativeVotesInt: result.negativeVotesInt,
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
