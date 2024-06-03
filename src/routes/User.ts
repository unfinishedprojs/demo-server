/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
import { RegisterReq } from '../types/Request';
import { checkForToken, createToken } from '../tools/token';
import { CtxErr, errCode } from '../types/Error';
export const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    let requestInfo: RegisterReq;

    if (req.body.discordId && req.body.invite) requestInfo = req.body as RegisterReq;
    else if (!req.body.discordId && req.body.invite) return res.status(400).json({ error: 'DiscordId missing' })
    else if (req.body.discordId && !req.body.invite) return res.status(400).json({ error: 'Invite missing' })
    else return res.status(400).json({ error: 'Values missing.' });

    const isUser = await checkForToken(requestInfo.discordId)

    if(isUser) return res.status(409).send({ error: 'Account already exists with that ID', code: errCode.ALREADYEXIST }  as CtxErr)

    const user = await createToken(requestInfo.discordId, requestInfo.invite)

    res.status(200).send(user)
});

// userRouter.post('/login', async (req, res) => {
//     if (req.query.slug?.length as number < 3 || req.query.slug?.length as number > 8) {
//         return res.status(400).json({ error: 'Username is too short or too long', code: 'SLUGLENGTH' });
//     }

//     if (req.query.password?.length as number < 5 || req.query.password?.length as number > 125) {
//         return res.status(400).json({ error: 'Password is too short or too long', code: 'PASSLENGTH' });
//     }

//     try {
//         const result = await prisma.user.findUnique({
//             where: {
//                 slug: req.query.slug as string,
//             },
//         });

//         if (!result) {
//             return res.status(404).json({ error: 'Account not found', code: 'NOACC' });
//         }

//         if (!bcrypt.compareSync(req.query.password as string, result.password)) {
//             return res.status(403).json({ error: 'Password is incorrect', code: 'NOPASS' });
//         }

//         res.status(200).json(result);
//     } catch (error) {
//         Logger.error(error);
//     }
// });