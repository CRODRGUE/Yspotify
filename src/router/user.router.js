module.exports = userRoutes => {

    const controller = require('../controller/user.controller');

    let router = require('express').Router();
    // Route pour gérer l'inscription au service
    router.post('/singup', controller.Singup);
    // Route pour gérer l'authentification d'un utilisateur (obtenir un token)
    router.get('/singin', controller.Singin)

    userRoutes.use(router);
}