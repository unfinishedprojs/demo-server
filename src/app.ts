import express, { Application, Request, Response } from "express";
import { version } from "../package.json";

// v1 Imports
import userRoutesV1 from "./routes/v1/userRoutes";
import iEventRoutesV1 from "./routes/v1/iEventRoutes";
import adminRoutesV1 from "./routes/v1/adminRoutes";

// v2 Imports
import userRoutesV2 from "./routes/v2/userRoutes";
import iEventRoutesV2 from "./routes/v2/iEventRoutes";
import adminRoutesV2 from "./routes/v2/adminRoutes";

import swaggerUi from "swagger-ui-express";
import { ActivityTypes, BotCustomActivity, Client } from "oceanic.js";
import cron from "node-cron";
import morgan from "morgan";
import yaml from "yaml";
import fs from "fs";
import { checkAndUpdateEventStatus } from "./services/v1/iEventService";
import cors from "cors";
import helmet from 'helmet';

export const env = process.env;

const app: Application = express();

const file = fs.readFileSync(__dirname + "/swagger/swagger.yml", "utf8");
const swaggerDocument = yaml.parse(file);

export const client = new Client({ auth: env.BOT_AUTH });

app.use(cors());
app.use(helmet());
app.use(express.json());

// V1 Routes

app.use("/api/v1/users", userRoutesV1);
app.use("/api/v1/ievents", iEventRoutesV1);
app.use("/api/v1/admin", adminRoutesV1);

// V2 Routes

app.use("/api/v2/users", userRoutesV2);
app.use("/api/v2/ievents", iEventRoutesV2);
app.use("/api/v2/admin", adminRoutesV2);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "API is running without irregular faults!", version: version });
});

client.on("ready", async () => {
  console.log("Ready as", client.user.tag);
  client.editStatus("idle", [
    {
      name: "you explod",
      state: "blowing up",
      type: ActivityTypes.LISTENING,
    } as unknown as BotCustomActivity,
  ]);
});

client.on("error", (err) => {
  console.error("Something Broke!", err);
});

cron.schedule("* * * * *", () => {
  checkAndUpdateEventStatus().catch(console.error);
});

client.connect();

export default app;
