export default {
    origins: [
        'http://localhost',
        'http://localhost:80',
        'http://localhost:5173',
        'https://localhost',
        ...(process.env.PROD_URL ? [process.env.PROD_URL] : []),
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    jsonLimit: "1mb",
}
