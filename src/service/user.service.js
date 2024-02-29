const tool = require('../tool/data.tool');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SECRET_KEY';

async function SaveUser({ username, password }) {
    // Vérification de la disponibilité du "username"
    if (tool.listUsers.find(user => user.username == username)) {
        return null;
    }

    // Ajout de l'utilisateur à la liste des utilisateurs avec les valeurs par défauts
    tool.listUsers.push({
        username: username,
        password: crypto.createHash('sha512').update(password).digest('hex'),
        spotify: {
            account_link: false,
            id: null,
            name: null,
            refresh_token: null,
        },
        groupe: {
            name: null,
            admin: null
        }
    });
    // Enregistrement des nouvelles données
    await tool.WriteFileDataUser(JSON.stringify(tool.listUsers));
    return { username, password };
}

async function SinginUser({ username, password }) {
    // Récupération des données de l'utilisateur lié à "username"
    const user = tool.listUsers.find(u => u.username == username);
    // Vérification de l'existence de l'utilisateur
    if (user) {
        // Vérification de correspondance du mot de passe
        if (user.password == crypto.createHash('sha512').update(password).digest('hex')) {
            // Génération du token JWT avec en donnée "username"
            let token = jwt.sign({
                username: user.username
            }, SECRET_KEY, {
                algorithm: 'HS512',
                expiresIn: (24 * 60 * 60)
            })
            return { token: token, type: 'Bearer', expiresIn: (24 * 60 * 60) };
        }
    }
    return null;
}

module.exports = {
    SaveUser,
    SinginUser
}