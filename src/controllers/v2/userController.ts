import { Request, Response } from "express";
import { createPasswordToken, getUserViaId } from "../../services/v2/userService";
import { DatabaseError } from "../../errors/DatabaseError";
import { checkForInvite, inviteInUse } from "../../services/v2/inviteService";
import { LoginRes } from "../../models/interfaces";
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { env } from "../../app";

export const getUser = async (req: Request, res: Response) => {
  const user = await getUserViaId(req.body.id);

  return res.status(200).json({
    discordId: user.discordId,
    admin: user.admin,
    discordUser: user.discordUser,
    discordSlug: user.discordSlug,
    discordPfpUrl: user.discordPfpUrl,
  } as LoginRes);
};

export const createUser = async (req: Request, res: Response) => {
  const { discordId, password, invite } = req.body;

  if (!discordId && !invite && !invite) {
    return res.status(400).json({ error: "Values missing." });
  }
  if (!discordId) {
    return res.status(400).json({ error: "DiscordId missing" });
  }
  if (!invite) {
    return res.status(400).json({ error: "Invite missing" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password missing" });
  }

  if (typeof discordId !== "string") {
    return res.status(401).json({ error: "DiscordId not a string" });
  }

  if (typeof invite !== "string") {
    return res.status(401).json({ error: "Invite not a string" });
  }

  if (typeof password !== "string") {
    return res.status(401).json({ error: "Password not a string" });
  }

  try {
    const inviteExists = await checkForInvite(invite);
    if (!inviteExists) {
      return res.status(409).json({ error: "No such Invite exists" });
    }

    const isInviteInUse = await inviteInUse(invite);
    if (isInviteInUse) {
      return res.status(409).json({ error: "Invite already in use" });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }

  try {
    const result = await createPasswordToken(discordId, password, invite);

    return res.status(201).json({
      discordId: result.discordId,
      admin: result.admin,
      discordUser: result.discordUser,
      discordSlug: result.discordSlug,
      discordPfpUrl: result.discordPfpUrl,
    } as LoginRes);
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

export const login = async (req: Request, res: Response) => {
  try {
    const { discordId, password } = req.body;

    if (!discordId && !password) {
      return res.status(400).json({ error: "Values missing." });
    }
    if (!discordId) {
      return res.status(400).json({ error: "DiscordId missing" });
    }
    if (!password) {
      return res.status(400).json({ error: "Invite missing" });
    }

    if (typeof discordId !== "string") {
      return res.status(401).json({ error: "DiscordId not a string" });
    }

    if (typeof password !== "string") {
      return res.status(401).json({ error: "Invite not a string" });
    }

    const user = await getUserViaId(discordId);

    if (!user) {
      return res.status(403).json({ error: "No user with that Discord ID!" });
    }

    const ror = await argon2.verify(user.token, password);

    if (!ror) {
      return res.status(403).json({ error: "Password or username is incorrect" });
    }

    const token = jwt.sign({ id: user.discordId, password: user.token, admin: user.admin }, env.PRIVATE as string, { expiresIn: '24h' });

    return res.status(200).json({
      token,
      discordId: user.discordId,
      admin: user.admin,
      discordUser: user.discordUser,
      discordSlug: user.discordSlug,
      discordPfpUrl: user.discordPfpUrl,
    } as LoginRes);
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
