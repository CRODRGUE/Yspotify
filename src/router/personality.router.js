module.exports = personalityRoutes => {
    const middleware = require('../middleware/token.JWT.middleware');
    const controller = require('../controller/personality.controller');

    const router = require('express').Router();

    router.get('/me/personality', middleware.checkTokenJWT, controller.UserPersonality);

    personalityRoutes.use(router);
}