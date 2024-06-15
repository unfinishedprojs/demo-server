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
import { checkForToken } from "../../services/v1/userService";
import { createInvite } from "../../services/v1/inviteService";
import { ApiResponse, EventRes } from "../../models/interfaces";

export const suggest = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const { discordId } = req.body;

    if (!discordId) {
      return res.status(400).json({ error: "DiscordId missing" });
    }

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    if (typeof discordId !== "string") {
      return res.status(401).json({ error: "DiscordId not a string" });
    }

    if (typeof token !== "string") {
      return res.status(401).json({ error: "Token not a string" });
    }

    if (!(await checkForToken(undefined, token))) {
      return res.status(401).json({ error: "Token not valid" });
    }

    if (((await countCVote(discordId)) as number) > 1) {
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
          duration: result.duration,
          ended: result.ended,
        } as EventRes,
      } as ApiResponse);
    }

    if ((await findCVote(discordId, token))?.createdAt) {
      return res.status(406).json({ error: "Vote already cast. Ignored" });
    }

    const result = await createCEvent(discordId, token);
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
    const { eventId } = req.body;
    const token = req.headers.authorization;

    if (!eventId) {
      return res.status(400).json({ error: "eventId missing" });
    }

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    if (typeof eventId !== "string") {
      return res.status(401).json({ error: "eventId not a string" });
    }

    if (typeof token !== "string") {
      return res.status(401).json({ error: "Token not a string" });
    }

    if (!(await checkForToken(undefined, token))) {
      return res.status(401).json({ error: "Token not valid" });
    }

    if ((await iEventVoted(eventId, token)) === true) {
      return res.status(406).json({ error: "Vote already cast. Ignored" });
    }

    const result = await iEventVotePos(eventId, token);

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
    const token = req.headers.authorization;
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "eventId missing" });
    }

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    if (typeof eventId !== "string") {
      return res.status(401).json({ error: "EventId not a string" });
    }

    if (typeof token !== "string") {
      return res.status(401).json({ error: "Token not a string" });
    }

    if (!(await checkForToken(undefined, token))) {
      return res.status(401).json({ error: "Token not valid" });
    }

    if ((await iEventVoted(eventId, token)) === true) {
      return res.status(406).json({ error: "Vote already cast. Ignored" });
    }

    const result = await iEventVoteNeg(eventId, token);

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
    const { active } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    if (typeof token !== "string") {
      return res.status(401).json({ error: "Token not a string" });
    }

    if (!(await checkForToken(undefined, token))) {
      return res
        .status(409)
        .json({ error: "No account with that token exists" });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = await getAllIEvent(active as boolean);

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
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    if (typeof token !== "string") {
      return res.status(401).json({ error: "Token not a string" });
    }

    if (!eventId) {
      return res.status(400).json({ error: "EventID missing" });
    }

    if (typeof eventId !== "string") {
      return res.status(401).json({ error: "EventID not a string" });
    }

    if (!(await checkForToken(undefined, token))) {
      return res
        .status(409)
        .json({ error: "No account with that token exists" });
    }

    const result = await findIEvent(eventId as string);

    return res.status(200).json({
      eventId: result.eventId,
      discordId: result.discordId,
      discordUser: result.discordUser,
      discordPicture: result.discordPfpUrl,
      discordSlug: result.discordSlug,
      ended: result.ended,
      createdAt: result.createdAt,
      duration: result.duration,
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
