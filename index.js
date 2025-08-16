import express from 'express';
import cors from 'cors';
import db from './db/index.js';
import routers from "./routers/index.js";
import authTokenMiddleware from "./middleware/authToken.js";

const app = express();
app.disable('etag');
app.use(cors({
    origin: [
        'http://localhost',
        'http://localhost:80',
        'https://localhost',
        process.env.PROD_URL || '',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({limit: "1mb"}));

db.connect();

app.use("/api", authTokenMiddleware);

app.use("/auth", routers.auth(express));
app.use("/api/user", routers.user(express));
app.use("/api/recipes", routers.recipes(express));

app.listen(3000);
