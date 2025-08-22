import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import consts from "./consts.js";

const jwt =  {
    authCodes: new Map(),
    getCode: (id) => {
        const code = crypto.randomBytes(16).toString('hex');
        jwt.authCodes.set(code, { userId: id, exp: Date.now() + consts.CODE_EXP });
        return code;
    },
    getTokensByCode: (code) => {
        if (!jwt.authCodes.has(code) || jwt.authCodes.get(code).exp < Date.now()) return null;
        const access = jsonwebtoken.sign({ userId: jwt.authCodes.get(code).userId }, consts.JWT_SECRET, { expiresIn: consts.ACCESS_EXP });
        const refresh = jsonwebtoken.sign({ userId: jwt.authCodes.get(code).userId }, consts.JWT_SECRET, { expiresIn: consts.REFRESH_EXP });
        jwt.authCodes.delete(code);
        return {
            access,
            refresh,
        }
    },
    verifyToken: (token) => {
        try {
            const decoded = jsonwebtoken.verify(token, consts.JWT_SECRET);
            return { valid: true, decoded };
        } catch (error) {
            return { valid: false };
        }
    },
    getByRefresh: (token) => {
        const check = jwt.verifyToken(token);
        if (!check.valid) return null;
        const access = jsonwebtoken.sign({ userId: check.decoded.userId }, consts.JWT_SECRET, { expiresIn: consts.ACCESS_EXP });
        return {
            access,
        };
    },
};

export default jwt;
