module.exports = groupeRoutes => {

    const middleware = require('../middleware/token.JWT.middleware');
    const controller = require('../controller/groupe.controller');

    const router = require('express').Router();
    // Route pour gérer une demande d'adhésion à groupe
    router.post('/groupes/:name_groupe/members', middleware.checkTokenJWT, controller.JoinGroupe);
    // Route pour obtenir les informations sur son groupe
    router.get('/groupes/:name_groupe/members', middleware.checkTokenJWT, controller.InfoGroupe);
    // Route pour synchroniser la musique avec son groupe
    router.get('/groupes/:name_groupe/synchronize', middleware.checkTokenJWT, controller.SynchronizeSongGroupe);
    // Route pour obtenir la liste des groupes 
    router.get('/groupes', middleware.checkTokenJWT, controller.ListGroupe);


    groupeRoutes.use(router);
}