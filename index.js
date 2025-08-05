import express from 'express';
import cors from 'cors';
import db from './db/index.js';

const app = express();
app.disable('etag');
app.use(cors({
    origin: [
        'http://localhost',
        'http://localhost:80',
        'https://localhost',
        process.env.PROD_URL || '',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({limit: "1mb"}));

db.connect();

app.get('/api/user', async (req, res) => {
    const userId = Number(req.query.id) || "";
    if (!userId) res.status(400).json({error: "id is empty"});
    try {
        const response = await db.client.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (response.rows.length) res.status(200).json(response.rows[0]);
        else res.status(400).json({error: "user not found"});
    } catch (error) {
        console.log("query error: ", error);
    }
});

app.get('/api/recipes', async (req, res) => {
    const userId = Number(req.query.userId) || "";
    const recipeId = Number(req.query.recipeId) || "";
    if (!userId) res.status(400).json({error: "userId is empty"});
    if (!recipeId) {
        try {
            const response = await db.client.query("SELECT id, title, description, ingredients FROM recipes WHERE user_id = $1", [userId]);
            if (response.rows.length) res.status(200).json(response.rows);
            else res.status(400).json({error: "recipes not found"});
        } catch (error) {
            console.log("query error: ", error);
        }
    } else {
        try {
            const response = await db.client.query("SELECT id, title, description, ingredients FROM recipes WHERE user_id = $1 AND id = $2", [userId, recipeId]);
            if (response.rows.length) res.status(200).json(response.rows[0]);
            else res.status(400).json({error: "recipe not found"});
        } catch (error) {
            console.log("query error: ", error);
        }
    }
});

app.put('/api/recipes', async (req, res) => {
    const recipeId = Number(req.query.id) || "";
    const body = req.body;
    try {
        if (recipeId) {
            const response = await db.client.query("SELECT title, description, ingredients FROM recipes WHERE id = $1", [recipeId]);
            if (!response.rows.length) res.status(400).json({error: "recipe not found"});
            else {
                const currentRecipe = response.rows[0];
                if (body.title) currentRecipe.title = body.title;
                if (body.description) currentRecipe.description = body.description;
                if (body.ingredients?.length) currentRecipe.ingredients = body.ingredients;
                const update = await db.client.query("UPDATE recipes SET title = $1, description = $2, ingredients = $3 WHERE id = $4", [currentRecipe.title, currentRecipe.description, currentRecipe.ingredients, recipeId]);
                if (update.rowCount) res.status(200).json({count: update.rowCount});
                else res.status(400).json({error: "recipe not updated"});
            }
        } else {
            if (!body.user_id) res.status(400).json({error: "user_id is empty"});
            else {
                const recipe = {
                    user_id: body.user_id,
                    title: body.title || "",
                    description: body.description || "",
                    ingredients: body.ingredients || [],
                }
                const add = await db.client.query("INSERT INTO recipes (user_id, title, description, ingredients) VALUES($1, $2, $3, $4)", [recipe.user_id, recipe.title, recipe.description, recipe.ingredients]);
                console.log(add);
                if (add.rowCount) res.status(200).json({count: add.rowCount});
                else res.status(400).json({error: "recipe not created"});
            }
        }
    } catch (error) {
        console.log("query error: ", error);
    }
})

app.listen(3000);
