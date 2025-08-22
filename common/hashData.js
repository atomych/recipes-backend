import bcrypt from "bcrypt";
const saltRounds = 10;

export async function hash(data) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(data, salt);
    } catch (err) {
        console.error('Ошибка при хешировании строки:', err);
        throw err;
    }
}

export async function compare(data, hash) {
    try {
        return await bcrypt.compare(data, hash);
    } catch (err) {
        console.error('Ошибка при проверке строки:', err);
        return false;
    }
}
