/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import 'dotenv/config';
import express from 'express';
import Logger from 'js-logger';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Client } from 'oceanic.js'
import cron from 'node-cron'

import { userRouter } from './routes/User';
import { iEventRouter } from './routes/InviteEvent';
import { checkAndUpdateEventStatus } from './tools/iEvent';


// eslint-disable-next-line node/no-process-env
const env = process.env;

export const client = new Client({ auth: env.BOT_AUTH })
export const prisma = new PrismaClient();

Logger.useDefaults();

function start() {
    // Creating anything useful
    const app = express();

    // Express shit

    app.use(express.json());

    app.use(express.urlencoded({
        extended: true,
    }));

    app.use(cors());

    app.use('/user', userRouter);
    app.use('/ievent', iEventRouter)

    if (env.DEBUG === 'true') {
        Logger.setLevel(Logger.DEBUG);

        console.log('started')

        app.listen(env.DEBUG_PORT, () => {
            Logger.info(`Started demo-server on debug port ${env.DEBUG_PORT}`);
        });
    } else {
        app.listen(env.PROD_PORT, () => {
            Logger.info(`Started demo-server on production port ${env.PROD_PORT}`);
        });
    }

    // Discord bot shit

    client.on("ready", async () => {
        console.log("Ready as", client.user.tag);
    });

    client.on("error", (err) => {
        console.error("Something Broke!", err);
    });

    client.connect();

    // CronJob shit

    cron.schedule('* * * * *', () => {
        checkAndUpdateEventStatus().catch(console.error)
    })
}

start();