import jwt from "../jwt/jwt.js";
import { compare, hash } from "../common/hashData.js";
import uuid from "../common/uuid.js";
import db from "../db/index.js";
import error from "../error/index.js";

function getByCode(req, res) {
    const code = req.body.code || "";
    const result = jwt.getTokensByCode(code);
    if (!result) return res.status(400).send(JSON.stringify(error.errors.auth.code.invalidCode));
    res.status(200).send(result);
}

function getByRefresh(req, res) {
    const token = req.body.refresh || "";
    const result = jwt.getByRefresh(token);
    if (!result) return res.status(400).send(JSON.stringify(error.errors.auth.refresh.invalidToken));
    res.status(200).send(result);
}

async function registerUser(req, res) {
    const { email, name, password } = req.body;
    const validEmail = email?.trim().toLowerCase() || "";
    if (!validEmail) return res.status(400).send(JSON.stringify(error.errors.auth.register.invalidEmail));
    const validName = name?.trim().toLowerCase() || "";
    if (!validName || validName.length < 4) return res.status(400).send(JSON.stringify(error.errors.auth.register.invalidName));
    const validPassword = password?.trim() || "";
    if (!validPassword || validPassword.length < 6) return res.status(400).send(JSON.stringify(error.errors.auth.register.invalidPassword));
    const hashedPassword = await hash(password);
    if (!hashedPassword) return res.status(400).send(JSON.stringify(error.errors.hash.error));
    const id = uuid();
    try {
        const query = await db.client.query("INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)", [id, validName, validEmail, hashedPassword]);
        if (query.rowCount) return res.status(200).send({ id });
        return res.status(400).send(JSON.stringify(error.errors.database.error));
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).send(JSON.stringify(error.errors.auth.register.duplicateEmail));
        }
        return res.status(400).send(JSON.stringify(error.errors.database.error));
    } finally {
        console.log("user register: finally");
    }
}

async function loginUser(req, res) {
    const { login, password } = req.body;
    const validLogin = login?.trim().toLowerCase() || "";
    if (!validLogin) return res.status(400).send(JSON.stringify(error.errors.auth.login.invalidLogin));
    try {
        const query = await db.client.query("SELECT id, password FROM users WHERE $1 = name OR $1 = email", [validLogin]);
        if (!query.rowCount) return res.status(400).send(JSON.stringify(error.errors.auth.login.invalidLogin));
        const hashedPassword = query.rows[0].password || "";
        const isValidPassword = await compare(password, hashedPassword);
        if (!isValidPassword) return res.status(400).send(JSON.stringify(error.errors.auth.login.invalidPassword));
        const id = query.rows[0].id;
        const code = jwt.getCode(id);
        return res.status(200).send({ id, code });
    } catch (error) {
        return res.status(400).send(JSON.stringify(error.errors.database.error));
    }
}

export default function(express) {
    if (!express) return;
    const router = express.Router();
    router.post("/code", getByCode);
    router.post("/refresh", getByRefresh);
    router.post("/register", registerUser);
    router.post("/login", loginUser);
    return router;
}
