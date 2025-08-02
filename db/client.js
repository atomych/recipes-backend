import pg from 'pg';
const { Client } = pg;

export const client = new Client({
    user: 'admin',
    host: 'localhost',
    database: 'mydb',
    password: 'password',
    port: 5432,
});

export function connect() {
    try {
        client.connect();
    } catch (error) {
        console.log("connection db error: ", error);
    }
}

export function disconnect() {
    try {
        client.close();
    } catch (error) {
        console.log("disconnect db error: ", error);
    }
}
