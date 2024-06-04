import express, { Application, Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import iEventRoutes from './routes/iEventRoutes'
import swaggerUi from 'swagger-ui-express';
import { ActivityTypes, BotCustomActivity, Client } from 'oceanic.js'
import cron from 'node-cron';
import morgan from 'morgan';
import yaml from 'yaml'
import fs from 'fs'
import { checkAndUpdateEventStatus } from './services/iEventService';

export const env = process.env;

const app: Application = express();

const file = fs.readFileSync(__dirname + '/swagger/swagger.yml', 'utf8')
const swaggerDocument = yaml.parse(file)

export const client = new Client({ auth: env.BOT_AUTH })

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/ievent', iEventRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(morgan('tiny'))

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

client.on("ready", async () => {
    console.log("Ready as", client.user.tag);
    client.editStatus("idle", [ { name: 'you explod', state: 'blowing up', type: ActivityTypes.LISTENING } as unknown as BotCustomActivity])
});

client.on("error", (err) => {
    console.error("Something Broke!", err);
});

cron.schedule('* * * * *', () => {
    checkAndUpdateEventStatus().catch(console.error)
})

client.connect();

export default app;