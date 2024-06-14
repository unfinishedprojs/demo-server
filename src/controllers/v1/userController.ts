import { Request, Response } from "express";
import { checkForToken, createToken } from "../../services/v1/userService";
import { DatabaseError } from "../../errors/DatabaseError";
import { checkForInvite, inviteInUse } from "../../services/v1/inviteService";
import { ApiResponse, LoginRes } from "../../models/interfaces";

export const getUsers = async (req: Request, res: Response) => {
  // const users = await prisma.user.findMany();
  res.json("trolled");
};

export const createUser = async (req: Request, res: Response) => {
  const { discordId, invite } = req.body;

  if (!discordId && !invite) {
    return res.status(400).json({ error: "Values missing." });
  }
  if (!discordId) {
    return res.status(400).json({ error: "DiscordId missing" });
  }
  if (!invite) {
    return res.status(400).json({ error: "Invite missing" });
  }

  if (typeof discordId !== "string") {
    return res.status(401).json({ error: "DiscordId not a string" });
  }

  if (typeof invite !== "string") {
    return res.status(401).json({ error: "Invite not a string" });
  }

  if (!(await checkForInvite(invite))) {
    return res.status(409).json({ error: "No such Invite exists" });
  }

  if (await inviteInUse(invite)) {
    return res.status(409).json({ error: "Invite already in use" });
  }

  if (await checkForToken(discordId, undefined)) {
    return res
      .status(409)
      .json({ error: "Account already exists with that ID" });
  }

  try {
    const result = await createToken(discordId, invite);

    return res
      .status(201)
      .json({
        discordId: result.discordId,
        token: result.token,
        admin: result.admin,
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
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    if (typeof token !== "string") {
      return res.status(401).json({ error: "Token not a string" });
    }

    const result = await checkForToken(undefined, token);

    if (!result) {
      return res.status(403).json({ error: "Token is invalid" });
    }

    return res
      .status(200)
      .json({
        discordId: result.discordId,
        token: result.token,
        admin: result.admin,
      } as LoginRes);
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error("Database error occurred:", error.cause);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
