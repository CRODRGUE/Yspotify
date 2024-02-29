module.exports = personalityRoutes => {
    const middleware = require('../middleware/token.JWT.middleware');
    const controller = require('../controller/personality.controller');

    const router = require('express').Router();
    // Route pour obtenir les gouts musicaux d'un utilisateur
    router.get('/me/personality', middleware.checkTokenJWT, controller.UserPersonality);

    personalityRoutes.use(router);
}