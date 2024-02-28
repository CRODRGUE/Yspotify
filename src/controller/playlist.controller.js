const service = require('../service/playlist.service');
const tool = require('../tool/data.tool');



async function CreatePlaylist(req, res) {
    // #swagger.tags = ['Personnalité de l\'utilisateur']
    // #swagger.security = [{"BearerAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-6), permet à un utilisateur authentifié et qui a lié son compte Spotify de pouvoir obtenir des données sur ses goûts musicaux grâce à l'analyse de ses titres likées'

    let data = {
        username_ask: res.locals.dataToken.username,
        username_target: req.params.username_target
    }
    if (!data.username_target) {
        return res.status(400).json({ code: 400, message: 'Impossible d\'exécuter cette demande, il manque des données' });
    }
    // Récuperation de l'utilisateur demandeur et cible
    const userAsk = tool.listUsers.find(u => u.username == data.username_ask);
    const userTarget = tool.listUsers.find(u => u.username == data.username_target);
    // Vérification que les deux utilisateurs adhèrent au même groupe
    if (!userAsk.groupe.name || !userTarget.groupe.name || userAsk.groupe.name != userTarget.groupe.name) {
        return res.status(403).json({ code: 403, message: 'Impossible d\'exécuter cette demande, due à problème de groupe' });
    }
    // Vérification que les comptes des deux utilisateurs soient liée
    if (!userAsk.spotify.id || !userTarget.spotify.id) {
        return res.status(400).json({ code: 400, message: 'Impossible d\'exécuter cette demande, due au compte Spotify non lié' });
    }

    // Récupération des 10 derniers musique likées de l'utilisateur cible
    let resGetLikedTracks = await service.getLikedTracks({ username: userTarget.username });
    if (resGetLikedTracks.length == 0) {
        return res.status(204).json({ code: 204, message: "Création de la playlist impossible, l'utilisateur n'a pas de musique likée" })
    }
    if (!resGetLikedTracks) {
        res.status(400).json({ code: 400, message: 'Une erreur s\'est produite, échec de la création de la playlist' })
    }

    let resCreatePlaylist = await service.createPlaylist({ usernameAsk: userAsk.username, idAsk: userAsk.spotify.id, usernameTarget: userTarget.username, listTracks: resGetLikedTracks });
    res.status(201).json({ code: 201, message: "Playlist créée avec succès" })
}

module.exports = {
    CreatePlaylist
}