import express from 'express';
import { iEventReq, voteReq } from '../types/Request';
import { createIEvent, iEventVoted, iEventVoteNeg, iEventVotePos } from '../tools/iEvent';
import { CtxErr, DbErr, errCode, intCode } from '../types/Error';
import { verifyToken } from '../tools/token';
import { createInvite } from '../tools/invite';
import { InviteModel } from '@prisma/client';
export const iEventRouter = express.Router();

iEventRouter.post('/create', async (req, res) => {
    let requestInfo: iEventReq;

    if (req.body.discordId && req.body.duration) requestInfo = req.body as iEventReq;
    else if (!req.body.discordId) return res.status(400).json({ error: 'DiscordId missing', code: errCode.MISSINGVALUES } as CtxErr)
    else return res.status(400).json({ error: 'Values missing.', code: errCode.MISSINGVALUES } as CtxErr);

    if(!requestInfo.duration) requestInfo.duration = 1440
    else requestInfo.duration = Number(requestInfo.duration)

    const invite = await createInvite(requestInfo.discordId) as InviteModel

    const result = await createIEvent((Math.random() * 10).toString(36).replace('.', ''), requestInfo.discordId, invite.invite , requestInfo.duration)

    res.status(200).send(result)
});

iEventRouter.post('/vote/positive', async (req, res) => {
    let requestInfo: voteReq;

    if (req.body.token && req.body.eventId) requestInfo = req.body as voteReq
    else return res.status(400).json({ error: 'Values missing. (Body requires "token" and "eventId" boolean values', code: errCode.MISSINGVALUES } as CtxErr);

    const validToken = await verifyToken(requestInfo.token)

    if (!validToken) return res.status(401).json({ error: 'Token not valid', code: errCode.INVALIDTOKEN })

    const voted = await iEventVoted(requestInfo.eventId, requestInfo.token)

    if (voted === true) return res.status(406).json({ error: 'Vote already cast. Ignored', code: errCode.ALREADYVOTED })

    const result = await iEventVotePos(requestInfo.eventId, requestInfo.token)

    if ((result as DbErr).code === intCode.P2002) return res.status(406).json({ error: 'Vote already cast. Ignored', code: errCode.ALREADYVOTED })

    res.status(200).json(result)
})

iEventRouter.post('/vote/negative', async (req, res) => {
    let requestInfo: voteReq;

    if (req.body.token && req.body.eventId) requestInfo = req.body as voteReq
    else return res.status(400).json({ error: 'Values missing. (Body requires "token" and "eventId" boolean values', code: errCode.MISSINGVALUES } as CtxErr);

    const validToken = await verifyToken(requestInfo.token)

    if (!validToken) return res.status(401).json({ error: 'Token not valid', code: errCode.INVALIDTOKEN })

    const voted = await iEventVoted(requestInfo.eventId, requestInfo.token)

    if (voted === true) return res.status(406).json({ error: 'Vote already cast. Ignored', code: errCode.ALREADYVOTED })

    const result = await iEventVoteNeg(requestInfo.eventId, requestInfo.token)

    if ((result as DbErr).code === intCode.P2002) return res.status(406).json({ error: 'Vote already cast. Ignored', code: errCode.ALREADYVOTED })

    res.status(200).json(result)
})