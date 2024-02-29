const service = require('../service/personality.service');

async function UserPersonality(req, res) {
    // #swagger.tags = ['Création de playlist']
    // #swagger.security = [{"BearerAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-8), permet à un utilisateur authentifié et qui a lié son compte Spotify de pouvoir creer une playliste avec le top 10 d'un membre de son groupe'

    let data = {
        username: res.locals.dataToken.username
    }

    const resPersonality = await service.getPersonality(data)
    res.json(resPersonality);
}

module.exports = {
    UserPersonality
}
