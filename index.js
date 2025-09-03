import express from 'express';
import cors from 'cors';
import db from './db/index.js';
import routers from "./routers/index.js";
import authTokenMiddleware from "./middleware/authToken.js";
import { LOG_LEVEL, log } from "./log/index.js";
import init from "./init/index.js";

const app = express();
log({level: LOG_LEVEL.INIT, message: "init express app"});

app.disable('etag');
app.use(cors({
    origin: init.origins,
    methods: init.methods,
    allowedHeaders: init.allowedHeaders,
}));
app.use(express.json({limit: init.jsonLimit}));
log({
    level: LOG_LEVEL.INIT,
    message: "set params on express app",
    origins: init.origins,
    methods: init.methods,
    allowedHeaders: init.allowedHeaders,
    jsonLimit: init.jsonLimit,
});

await db.connect();
log({
    level: LOG_LEVEL.DATABASE,
    message: "connect to database",
})

app.use("/api", authTokenMiddleware);
app.use("/auth", routers.auth(express));
app.use("/api/user", routers.user(express));
app.use("/api/recipes", routers.recipes(express));
log({
    level: LOG_LEVEL.INIT,
    message: "set routers on express app",
})

app.listen(3000);
