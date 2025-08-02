import pg from 'pg';
const { Client } = pg;

export const client = new Client({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mydb',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

export function connect() {
    try {
        client.connect();
    } catch (error) {
        console.log("connection db error: ", error);
    }
}
