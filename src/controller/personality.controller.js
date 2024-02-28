const service = require('../service/personality.service');

async function UserPersonality(req, res) {
    // #swagger.tags = ['Personnalité de l\'utilisateur']
    // #swagger.security = [{"BearerAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-6), permet à un utilisateur authentifié et qui a lié son compte Spotify de pouvoir obtenir des données sur ses goûts musicaux grâce à l\'analyse de ses titres likées'

    let data = {
        username: res.locals.dataToken.username
    }

    const resPersonality = await service.getPersonality(data)
    res.json(resPersonality);
}

module.exports = {
    UserPersonality
}
