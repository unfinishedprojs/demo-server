import { Request, Response } from 'express';
import { checkForToken, createToken } from '../services/userService';
import { DatabaseError } from '../errors/DatabaseError';
import { checkForInvite, inviteInUse } from '../services/inviteService';

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

  if(!(await checkForInvite(invite))) {
    return res.status(409).json({ message: 'No such Invite exists' });
  }

  if (await inviteInUse(invite)) {
    return res.status(409).json({ message: 'Invite already in use' });
  }

  if (await checkForToken(discordId, undefined)) {
    return res.status(409).json({ message: 'Account already exists with that ID' });
  }

  try {
    const user = await createToken(discordId, invite)

    res.status(201).json(user)
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