export default {
    database: {
        error: {
            code: 10001,
            message: "database error",
        },
    },
    hash: {
        error: {
            code: 10002,
            message: "hash error",
        },
    },
    middleware: {
        auth: {
            notFound: {
                code: 10003,
                message: "token not found",
            },
            invalidFormat: {
                code: 10004,
                message: "invalid token format",
            },
            invalidToken: {
                code: 10005,
                message: "invalid token",
            },
            internal: {
                code: 10006,
                message: "internal error",
            },
        },
    },
    auth: {
        code: {
            invalidCode: {
                code: 111,
                message: "invalid authorization code",
            }
        },
        refresh: {
            invalidToken: {
                code: 121,
                message: "invalid authorization token",
            }
        },
        register: {
            invalidEmail: {
                code: 131,
                message: "invalid user email",
            },
            invalidName: {
                code: 132,
                message: "invalid user name",
            },
            invalidPassword: {
                code: 133,
                message: "invalid user password",
            },
            duplicateEmail: {
                code: 134,
                message: "duplicate email",
            },
        },
        login: {
            invalidLogin: {
                code: 141,
                message: "invalid user login",
            },
            invalidPassword: {
                code: 142,
                message: "invalid user password",
            },
        }
    },
    recipes: {
        list: {
            getList: {
                code: 211,
                message: "get all recipes error",
            }
        },
        getRecipe: {
            recipeIdNotFound: {
                code: 221,
                message: "recipeId not found",
            },
            notFound: {
                code: 222,
                message: "recipe not found",
            },
        },
        deleteRecipe: {
            recipeIdNotFound: {
                code: 231,
                message: "recipeId not found",
            },
            notFound: {
                code: 232,
                message: "recipe not found",
            },
        },
        updateRecipe: {
            recipeIdNotFound: {
                code: 241,
                message: "recipeId not found",
            },
            invalidTitle: {
                code: 242,
                message: "required title not found",
            },
            notFound: {
                code: 243,
                message: "recipe not found",
            },
        },
    },
    user: {
        userInfo: {
            notFound: {
                code: 311,
                message: "user not found",
            },
        },
    },
};
