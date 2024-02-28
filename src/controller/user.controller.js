const service = require('../service/user.service');

async function Singup(req, res) {
    // #swagger.tags = [' Connexion & Inscription']
    // #swagger.description = 'Cet endpoints (FT-1), permet à un utilisateur non authentifié de pouvoir s\'inscrire au service'
    // Récupération des données de l'utilisateur
    const { username, password } = req.body;
    // Vérification de la conformité des données (uniquement la présence)
    if (!username || !password) {
        return res.status(400).json({ code: 400, message: 'Les informations sont incomplètes, mot de passe ou nom d\'utilisateur manquant' });
    }
    // Ajout de l'utilisateur (avec gestion des erreurs)
    const newUser = await service.SaveUser({ username, password });
    if (!newUser) {
        return res.status(400).json({ code: 400, message: 'Nom d\'utilisateur déjà utilisé' });
    }
    return res.status(201).json({ code: 201, message: 'Compte créer avec succés' });
}

async function Singin(req, res) {
    // #swagger.tags = [' Connexion & Inscription']
    // #swagger.security = [{"BasicAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-2), permet à un utilisateur de pouvoir s\'authentifier au près du service'
    // Récupération du token (Basic) pour permettre l'authentification
    let token = req.headers['authorization'] || req.headers['Authorization'];
    // Vérification de la correspondance du token (Basic)
    if (!token || !token.startsWith('Basic ')) {
        return res.status(401).json({ code: 401, message: 'Vous devez vous authentifier pour demander un token' });
    }
    // Récupération du nom d'utilisateur et mot de passe présent dans le token 'Basic'
    const [username, password] = atob(token.split(' ')[1]).split(':');

    // Vérification de la conformité des données (uniquement la présence)
    if (!username || !password) {
        return res.status(400).json({ code: 400, message: 'Les informations sont incomplètes, mot de passe ou nom d\'utilisateur manquant' });
    }

    // Vérification de la correspondance des données avec un utilisateur pour obtenir un token JWT
    let tokenJWT = await service.SinginUser({ username, password });
    if (!tokenJWT) {
        return res.status(400).json({ code: 400, message: 'Le nom d\'utilisateur ou le mot de passe est incorrecte' })
    }
    return res.status(200).json({ access_token: tokenJWT.token, token_type: tokenJWT.type, expires_in: tokenJWT.expiresIn });
}

module.exports = {
    Singup,
    Singin
}