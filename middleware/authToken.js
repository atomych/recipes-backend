import jwt from "../jwt/jwt.js";

export default async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).send({error: "authorization token: token not found"});
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== "Bearer") return res.status(401).send({error: "authorization token: invalid token format"});
        const tokenCheck = jwt.verifyToken(token);
        if (!tokenCheck.valid) return res.status(401).send({error: "authorization token: invalid token"});
        req.user = {
            id: tokenCheck.decoded.userId || "",
        };
        next();
    } catch (error) {
        return res.status(500).send({ error: "authorization token: internal error" });
    }
}
