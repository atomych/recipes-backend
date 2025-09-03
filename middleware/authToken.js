import jwt from "../jwt/jwt.js";
import error from "../error/index.js";

export default async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).send(JSON.stringify(error.errors.middleware.auth.notFound));
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== "Bearer") return res.status(401).send(JSON.stringify(error.errors.middleware.auth.invalidFormat));
        const tokenCheck = jwt.verifyToken(token);
        if (!tokenCheck.valid) return res.status(401).send(JSON.stringify(error.errors.middleware.auth.invalidToken));
        req.user = {
            id: tokenCheck.decoded.userId || "",
        };
        next();
    } catch (error) {
        return res.status(500).send(JSON.stringify(error.errors.middleware.auth.internal));
    }
}
