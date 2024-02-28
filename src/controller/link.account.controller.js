const service = require('../service/link.account.service');

function LinkSpotifyAccount(req, res) {
    // #swagger.tags = ['Liaison du compte Spotify']
    // #swagger.security = [{"BearerAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-3), permet à un utilisateur authentifié de pouvoir demander la liaison de son compte Spotify au service pour profiter des fonctionnalités qui exploite l\'API de Spotify'

    // Préparation du lien pour effectuer la demande d'autorisation d'accès
    const LinkAccountURL = service.urlLinkAccount(res.locals.dataToken.username);
    res.status(200).json({
        code: 200,
        message: 'Vous devez ouvrir l\'URL dans votre navigateur pour autoriser l\'acces à vos données',
        url: LinkAccountURL
    });
}

async function LinkSpotifyAccountCallBack(req, res) {
    // #swagger.tags = ['Liaison du compte Spotify']
    // #swagger.description = 'Cet endpoints (FT-3), permet de traiter la réponse de la demande de liaison de son compte Spotify au service'

    // Vérification de la présence d'une erreur dans la réponse pour indiquer le refus
    if (req.query.error) {
        return res.status(400).json({ code: 400, message: 'Liaison du compte Spotify impossible : Accès refusé par l\'utilisateur' });
    }

    // Récupération des données
    const dataToken = {
        code: req.query.code,
        state: req.query.state
    };

    // Vérification de la présence des données nécessaires pour lier le compte
    if (!dataToken.code || !dataToken.state) {
        return res.status(400).json({ code: 400, message: "Liaison du compte Spotify impossible, il manque des données pour effectuer cette demande" });
    }
    console.log({ code: dataToken.code, state: dataToken.state });
    const spotifyToken = await service.getSpotifyToken({ code: dataToken.code, state: dataToken.state });
    console.log(`spotifyToken ===> ${spotifyToken}`);
    console.log({ access_token: spotifyToken?.access_token, refresh_token: spotifyToken?.refresh_token, username: spotifyToken?.username });
    const spotifyUserData = await service.getSpotifyUserData({ access_token: spotifyToken?.access_token, refresh_token: spotifyToken?.refresh_token, username: spotifyToken?.username });
    console.log(`spotifyUserData ===> ${spotifyUserData}`);
    if (!spotifyToken || !spotifyToken) {
        return res.status(400).json({ code: 400, message: "Échec de la liaison du compte Spotify, une erreur est survenu" }); // ici bp ? */
    }
    return res.status(200).json({ code: 200, message: 'Liaison du compte Spotify réussie avec succès' })
    /* const linkAccountRes = await service.callBackLinkAccount(dataToken);
    console.log("LinkSpotifyAccountCallBack ==>", linkAccountRes); // undefine
    if (linkAccountRes != null) {
        return res.status(200).json({ code: 200, message: 'Liaison du compte Spotify réussie avec succès' })
    }
    return res.status(400).json({ code: 400, message: "Échec de la liaison du compte Spotify, une erreur est survenu" }) // ici bp ? */
}

module.exports = {
    LinkSpotifyAccount,
    LinkSpotifyAccountCallBack
}