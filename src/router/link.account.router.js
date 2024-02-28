module.exports = linkSpotifyAccountRoutes => {
    const controller = require('../controller/link.account.controller')
    const middleware = require('../middleware/token.JWT.middleware')

    const router = require('express').Router();
    // Route pour générer la demande de liaison du compte Spotify 
    router.get('/spotify/link', middleware.checkTokenJWT, controller.LinkSpotifyAccount);
    // Route pour gérer la réponse de la demande de liaison du compte Spotify 
    router.get('/spotify/callback', controller.LinkSpotifyAccountCallBack);

    //router.get('/spotify/refersh', controller.LinkSpotifyAccountCallBack);

    linkSpotifyAccountRoutes.use(router);
}