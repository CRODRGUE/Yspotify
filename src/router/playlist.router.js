module.exports = playlistRoutes => {

    const middleware = require('../middleware/token.JWT.middleware');
    const controller = require('../controller/playlist.controller');

    const router = require('express').Router();

    router.post('/playlist/:username_target', middleware.checkTokenJWT, controller.CreatePlaylist)

    playlistRoutes.use(router);
}