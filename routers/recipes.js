import db from "../db/index.js";
import uuid from "../common/uuid.js";
import error from "../error/index.js";

async function getAllUserRecipes(req, res) {
    const userId = req.user.id;
    const searchValue = req.query.search?.trim() || "";
    try {
        const query = await db.client.query("SELECT id, title, description, ingredients, tags, last_update  FROM recipes WHERE user_id = $1", [userId]);
        const recipes = searchValue ? query.rows.filter(recipe => recipe.title.includes(searchValue) || recipe.description.includes(searchValue)) : query.rows;
        return res.status(200).send({
            total: recipes.length,
            recipes,
        });
    } catch (error) {
        return res.status(500).send(JSON.stringify(error.errors.recipes.list.getList));
    }
}

async function getRecipe(req, res) {
    const userId = req.user.id;
    const recipeId = req.params.id || "";
    if (!recipeId) return res.status(400).send(JSON.stringify(error.errors.recipes.getRecipe.recipeIdNotFound));
    try {
        const query = await db.client.query("SELECT id, title, description, ingredients, tags, last_update  FROM recipes WHERE user_id = $1 AND id = $2", [userId, recipeId]);
        if (!query.rowCount) return res.status(400).send(JSON.stringify(error.errors.recipes.getRecipe.notFound));
        return res.status(200).send(query.rows[0]);
    } catch(error) {
        return res.status(500).send(JSON.stringify(error.errors.database.error));
    }
}

async function deleteRecipe(req, res) {
    const userId = req.user.id;
    const recipeId = req.params.id || "";
    if (!recipeId) return res.status(400).send(JSON.stringify(error.errors.recipes.deleteRecipe.recipeIdNotFound));
    try {
        const query = await db.client.query("SELECT id FROM recipes WHERE user_id = $1 AND id = $2", [userId, recipeId]);
        if (!query.rowCount) return res.status(400).send(JSON.stringify(error.errors.recipes.deleteRecipe.notFound));
        const deleteRecipe = await db.client.query("DELETE FROM recipes WHERE user_id = $1 AND id = $2", [userId, recipeId]);
        if (!deleteRecipe.rowCount) return res.status(400).send(JSON.stringify(error.errors.database.error));
        return res.status(200).send({});
    } catch (error) {
        return res.status(500).send(JSON.stringify(error.errors.database.error));
    }
}

async function updateRecipe(req, res) {
    const userId = req.user.id;
    const recipeId = req.params.id || "";
    if (!recipeId) return res.status(400).send(JSON.stringify(error.errors.recipes.updateRecipe.recipeIdNotFound));
    if (recipeId === "new") {
        const id = uuid();
        const title = req.body.title || "";
        if (!title) res.status(400).send(JSON.stringify(error.errors.recipes.updateRecipe.invalidTitle));
        const description = req.body.description || "";
        const ingredients = req.body.ingredients || [];
        const tags = req.body.tags || [];
        const lastUpdate = new Date().toISOString();
        try {
            const add = await db.client.query("INSERT INTO recipes (id, user_id, title, description, ingredients, tags, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7)", [id, userId, title, description, ingredients, tags, lastUpdate]);
            if (!add.rowCount) return res.status(400).send(JSON.stringify(error.errors.database.error));
            return res.status(200).send({ id });
        }  catch (error) {
            return res.status(500).send(JSON.stringify(error.errors.database.error));
        }
    }
    try {
        const query = await db.client.query("SELECT * FROM recipes WHERE id = $1", [recipeId]);
        if (!query.rowCount) return res.status(400).send(JSON.stringify(error.errors.recipes.updateRecipe.notFound));
        const recipe = query.rows[0];
        const validTitle = req.body.title?.trim() || recipe.title;
        const validDescription = req.body.description?.trim() || recipe.description;
        const validIngredients = req.body.ingredients || recipe.ingredients;
        const validTags = req.body.tags || recipe.tags;
        const lastUpdate = new Date().toISOString();
        const update = await db.client.query("UPDATE recipes SET title = $1, description = $2, ingredients = $3, tags = $4, last_update = $5 WHERE id = $6", [validTitle, validDescription, validIngredients, validTags, lastUpdate, recipeId]);
        if (!update.rowCount) return res.status(400).send(JSON.stringify(error.errors.database.error));
        return res.status(200).send({ id: recipeId });
    } catch (error) {
        return res.status(500).send(JSON.stringify(error.errors.database.error));
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
