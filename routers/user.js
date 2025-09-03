import db from "../db/index.js";
import error from "../error/index.js";

async function getUserInfo(req, res) {
    const userId = req.user.id;
    try {
        const query = await db.client.query("SELECT name, email FROM users WHERE id = $1", [userId]);
        if (!query.rowCount) return res.status(400).send(JSON.stringify(error.errors.user.userInfo.notFound));
        return res.status(200).send(query.rows[0]);
    } catch (error) {
        return res.status(500).send(JSON.stringify(error.errors.database.error))
    }
}

export default function(express) {
    if (!express) return;
    const router = express.Router();
    router.get("/info", getUserInfo);
    return router;
}
