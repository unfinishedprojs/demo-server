import { Request, Response } from 'express';
import { checkForToken, createToken } from '../services/userService';
import { DatabaseError } from '../errors/DatabaseError';
import { checkForInvite, inviteInUse } from '../services/inviteService';
import { ApiResponse, LoginRes } from '../models/interfaces';

export const getUsers = async (req: Request, res: Response) => {
  // const users = await prisma.user.findMany();
  res.json('trolled');
};

export const createUser = async (req: Request, res: Response) => {
  const { discordId, invite } = req.body;

  if (!discordId && !invite) {
    return res.status(400).json({ message: 'Values missing.' });
  }
  if (!discordId) {
    return res.status(400).json({ message: 'DiscordId missing' });
  }
  if (!invite) {
    return res.status(400).json({ message: 'Invite missing' });
  }

  if (typeof discordId !== 'string') {
    return res.status(401).json({ message: 'DiscordId not a string' })
  }

  if (typeof invite !== 'string') {
    return res.status(401).json({ message: 'Invite not a string' })
  }

  if (!(await checkForInvite(invite))) {
    return res.status(409).json({ message: 'No such Invite exists' });
  }

  if (await inviteInUse(invite)) {
    return res.status(409).json({ message: 'Invite already in use' });
  }

  if (await checkForToken(discordId, undefined)) {
    return res.status(409).json({ message: 'Account already exists with that ID' });
  }

  try {
    const result = await createToken(discordId, invite)

    return res.status(201).json({ discordId: result.discordId, token: result.token, admin: result.admin } as LoginRes);
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error('Database error occurred:', error.cause);
      res.status(500).json({ message: error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      return res.status(400).json({ message: 'Token missing' });
    }

    if (typeof token !== 'string') {
      return res.status(401).json({ message: 'Token not a string' })
    }

    const result = await checkForToken(undefined, token);

    return res.status(200).json({ discordId: result.discordId, token: result.token, admin: result.admin } as LoginRes);
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error('Database error occurred:', error.cause);
      res.status(500).json({ message: error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}