module.exports = {
    dbUri : process.env.DB_URI,
    secretKeys : {
        jwt : process.env.TOKEN_SECRET
    },
    swageerOptions: {
        swaggerOptions: {
          defaultModelsExpandDepth: 0,
        },
    },
    bcryptSalt : {
        salt : process.env.SALT
    }
}