export default {
    CODE_EXP: process.env.CODE_EXP || 300000,
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    ACCESS_EXP: process.env.ACCESS_EXP || "1h",
    REFRESH_EXP: process.env.REFRESH_EXP || "1d",
}
