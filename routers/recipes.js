import db from "../db/index.js";
import uuid from "../common/uuid.js";

async function getAllUserRecipes(req, res) {
    const userId = req.user.id;
    try {
        const query = await db.client.query("SELECT id, title, description, ingredients, tags, last_update  FROM recipes WHERE user_id = $1", [userId]);
        const recipes = query.rows;
        return res.status(200).send({
            total: recipes.length,
            recipes,
        });
    } catch (error) {
        return res.status(500).send({ error: "get all user recipes: internal error" });
    }
}

async function getRecipe(req, res) {
    const userId = req.user.id;
    const recipeId = req.params.id || "";
    if (!recipeId) return res.status(400).send({ error: "get recipe: recipeId not found" });
    try {
        const query = await db.client.query("SELECT id, title, description, ingredients, tags, last_update  FROM recipes WHERE user_id = $1 AND id = $2", [userId, recipeId]);
        if (!query.rowCount) return res.status(400).send({ error: "get recipe: recipe not fount" });
        return res.status(200).send(query.rows[0]);
    } catch(error) {
        return res.status(500).send({ error: "get recipe: internal error" });
    }
}

async function deleteRecipe(req, res) {
    const userId = req.user.id;
    const recipeId = req.params.id || "";
    if (!recipeId) return res.status(400).send({ error: "delete recipe: recipeId not found" });
    try {
        const query = await db.client.query("SELECT id FROM recipes WHERE user_id = $1 AND id = $2", [userId, recipeId]);
        if (!query.rowCount) return res.status(400).send({ error: "get recipe: recipe not fount" });
        const deleteRecipe = await db.client.query("DELETE FROM recipes WHERE user_id = $1 AND id = $2", [userId, recipeId]);
        if (!deleteRecipe.rowCount) return res.status(400).send({ error: "delete recipe: database error" });
        return res.status(200).send({});
    } catch (error) {
        return res.status(500).send({ error: "delete recipe: internal error" });
    }
}

async function updateRecipe(req, res) {
    const userId = req.user.id;
    const recipeId = req.params.id || "";
    if (!recipeId) return res.status(400).send({ error: "update recipe: recipeId not found" });
    if (recipeId === "new") {
        const id = uuid();
        const title = req.body.title || "";
        if (!title) res.status(400).send({ error: "update recipe: required title not found" });
        const description = req.body.description || "";
        const ingredients = req.body.ingredients || [];
        const tags = req.body.tags || [];
        const lastUpdate = new Date().toISOString();
        try {
            const add = await db.client.query("INSERT INTO recipes (id, user_id, title, description, ingredients, tags, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7)", [id, userId, title, description, ingredients, tags, lastUpdate]);
            if (!add.rowCount) return res.status(400).send({ error: "update recipe: database error" });
            return res.status(200).send({ id });
        }  catch (error) {
            return res.status(500).send({ error: "update recipe: internal error" });
        }
    }
    try {
        const query = await db.client.query("SELECT * FROM recipes WHERE id = $1", [recipeId]);
        if (!query.rowCount) return res.status(400).send({ error: "update recipe: recipe not found" });
        const recipe = query.rows[0];
        const validTitle = req.body.title?.trim() || recipe.title;
        const validDescription = req.body.description?.trim() || recipe.description;
        const validIngredients = req.body.ingredients || recipe.ingredients;
        const validTags = req.body.tags || recipe.tags;
        const lastUpdate = new Date().toISOString();
        const update = await db.client.query("UPDATE recipes SET title = $1, description = $2, ingredients = $3, tags = $4, last_update = $5 WHERE id = $6", [validTitle, validDescription, validIngredients, validTags, lastUpdate, recipeId]);
        if (!update.rowCount) return res.status(400).send({ error: "update recipe: database error" });
        return res.status(200).send({ id: recipeId });
    } catch (error) {
        return res.status(500).send({ error: "update recipe: internal error" });
    }
}

export default function(express) {
    if (!express) return;
    const router = express.Router();
    router.get("/list", getAllUserRecipes);
    router.get("/:id", getRecipe);
    router.delete("/:id", deleteRecipe);
    router.put("/:id", updateRecipe)
    return router;
}
