function getFilteredRecipes(recipes=[], options={}) {
    if (!recipes.length) return recipes;
    const validFilters = userFilters(recipes);
    return recipes.reduce((acc, recipe) => {
        let needAdd = true;
        if (options.search) {
            const searchValue = options.search.trim().toLowerCase();
            const searchedTitle = recipe.title.trim().toLowerCase();
            const searchedDescription = recipe.description.trim().toLowerCase();
            if (!searchedTitle.includes(searchValue) && !searchedDescription.includes(searchValue)) {
                needAdd = false;
            }
        }
        if (options.tags) {
            options.tags.forEach(tag => {
                if (!recipe.tags.includes(tag) && validFilters.tags.includes(tag)) {
                    needAdd = false;
                }
            })
        }
        if (options.ingredients) {
            options.ingredients.forEach(ingredient => {
                if (!recipe.ingredients.includes(ingredient) && validFilters.ingredients.includes(ingredient)) {
                    needAdd = false;
                }
            })
        }
        if (needAdd) acc.push(recipe);
        return acc;
    }, []);
}

function userFilters(recipes=[]) {
    return {
        tags: recipes.reduce((acc, recipe) => {
            const tags = recipe.tags;
            tags.forEach(tag => {
                if (!acc.includes(tag)) acc.push(tag);
            });
            return acc;
        }, []),
        ingredients: recipes.reduce((acc, recipe) => {
            const ingredients = recipe.ingredients;
            ingredients.forEach(ingredient => {
                if (!acc.includes(ingredient)) acc.push(ingredient);
            });
            return acc;
        }, []),
    }
}

export default {
    getFilteredRecipes,
    userFilters,
}
