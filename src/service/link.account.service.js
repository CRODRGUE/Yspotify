const crypto = require('crypto');
const axios = require('axios');
const queryString = require('querystring');
const tool = require('../tool/data.tool');



const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const LIST_SCOPE = ['user-read-private', 'user-read-email', 'user-library-read', 'user-read-currently-playing', 'user-modify-playback-state', 'playlist-modify-public', 'playlist-modify-private', 'user-read-playback-state'];
const REDIRECT_URI = 'http://localhost:8080/spotify/callback';


const listLink = new Map();

function urlLinkAccount(username) {
    // Génération d'un state (code) pour permettre d'identifier la demande
    const state = crypto.randomBytes(32).toString('hex');
    // Ajout de la demande à la map (variable globale) 
    listLink.set(state, username);
    // Retour de l'URL avec les données nécessaires (type, id client, scopes, l'URL de redirection et state)
    return 'https://accounts.spotify.com/authorize?' + queryString.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: LIST_SCOPE.join(' '),
        redirect_uri: REDIRECT_URI,
        state: state
    });
}

async function getSpotifyToken({ code, state }) {
    // Vérification et récupération de l'username du demandeur
    const reqByUser = listLink.get(state);
    if (!reqByUser) {
        return null
    }
    // Suppression de la demande de la map (variable global)
    listLink.delete(state);

    return await axios.post('https://accounts.spotify.com/api/token', {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
    }, {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        }
    }).then((response) => {
        if (response.status === 200) {
            return {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                username: reqByUser
            };
        }
        return null;
    }).catch((err) => {
        console.log(`Erreur "getSpotifyToken" : ${err}`);
        return null;
    });
}

async function getSpotifyUserData({ access_token, refresh_token, username }) {
    return await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }).then(async (response) => {
        let user = tool.listUsers.find(u => u.username == username);

        user.spotify = {
            refresh_token: refresh_token,
            id: response.data.id,
            name: response.data.display_name
        };

        await tool.WriteFileDataUser(JSON.stringify(tool.listUsers));
        return user;
    }).catch((err) => {
        console.log(`Erreur "getSpotifyUserData" : ${err}`);
        return null
    });

}


async function refershSpotifyToken({ username }) {
    let user = tool.listUsers.find(u => u.username == username);
    if (user && user.spotify.refresh_token) {
        return await axios.post('https://accounts.spotify.com/api/token', {
            grant_type: 'refresh_token',
            refresh_token: user.spotify.refresh_token
        }, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            }
        }).then(async (response) => {
            if (response.status === 200) {
                return response.data.access_token;
            }
            return null;
        }).catch((err) => {
            console.log(`Erreur "refershSpotifyToken" : ${err}`);
            return null;
        });
    }
    return null;
}


module.exports = {
    urlLinkAccount,
    getSpotifyToken,
    getSpotifyUserData,
    refershSpotifyToken
}