const jwt = require('jsonwebtoken');
const SECRET_KEY = 'SECRET_KEY';

function checkTokenJWT(req, res, next) {
    // Récupération du token dans le header
    let token = req.headers['authorization'] || req.headers['Authorization'];
    // Vérification de la correspondance du type su TOKEN (Bearer)
    if (!token & !token.startsWith('Bearer ')) {
        return res.status(403).json({ code: 403, message: "Probleme lié au type de token" })
    }

    if (token) {
        // Récupération du token JWT
        const JWT = token.split(' ')[1];
        // Vérification de la validité du token
        jwt.verify(JWT, SECRET_KEY, (errToken, decodeToken) => {
            if (errToken) {
                return res.status(401).json({ code: 401, message: "Token invalide" })
            }
            // Ajout des données du token JWT decodé pour les couches suivante
            res.locals.dataToken = decodeToken;
            // Passage à la couche suivante
            return next();
        })
    } else {
        return res.status(401).json({ code: 401, message: "Token manquant" });
    }
}

module.exports = {
    checkTokenJWT
}