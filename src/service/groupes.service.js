const { response } = require('express');
const tool = require('../tool/data.tool');
const axios = require('axios');
const { refershSpotifyToken } = require('./link.account.service')

async function addMembersGroupe({ username, nameGroupe }) {
    // Récupération des données liées à l'utilisateur demandeur
    let user = tool.listUsers.find(u => u.username === username);
    // Vérification de la présence dans le groupe
    if (user.groupe.name === nameGroupe) {
        return user;
    }

    // Vérification du rôle de l'utilisateur dans l'objectif d'attribuer un nouvel administrateur
    if (user.groupe.admin) {
        let listMembers = tool.listUsers.filter(u => u.groupe.name === user.groupe.name && !u.groupe.admin);
        if (listMembers.length > 0) {
            const randomIndex = Math.round(Math.random() * listMembers.length);
            listMembers[randomIndex].groupe.admin = true;
        }
    }

    const groupeExist = tool.listUsers.find(u => u.groupe.name != null && u.groupe.name === nameGroupe);
    // Modification des données de l'utilisateur
    user.groupe = {
        name: nameGroupe,
        admin: groupeExist ? false : true
    }
    // Enregistrement des données modifiées 
    await tool.WriteFileDataUser(JSON.stringify(tool.listUsers));
    return user;
}

function listGroupe() {
    let listGroupe = new Set();
    tool.listUsers.map(u => {
        if (u.groupe.name != null) {
            listGroupe[u.groupe.name] ? listGroupe[u.groupe.name].membres++ : listGroupe[u.groupe.name] = { groupe: u.groupe.name, membres: 1 }
        }
    })
    return listGroupe
}

async function getGroupeInfo({ nameGroupe }) {
    let listMembers = [];
    for (const user of tool.listUsers.filter(u => u.groupe.name === nameGroupe)) {
        let userInfo = {
            username: user.username,
            isAdmin: user.groupe.admin,
        };
        // Récupération des informations liées au compte Spotify si liaison effectuée.
        if (user.spotify.id) {
            const token = await refershSpotifyToken({ username: user.username });
            await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                if (response.status == 200) {
                    listArtists = [];
                    response.data.item.artists.map(a => listArtists.push(a.name));
                    userInfo.spotify = {
                        pseudo: user.spotify.name,
                        currentTrack: {
                            name: response.data.item.name,
                            artist: listArtists,
                            album: response.data.item.album.name
                        },
                        currentDivice: "unknown"
                    }
                };
                if (response.status === 204) {
                    userInfo.spotify = {
                        pseudo: user.spotify.name,
                        currentTrack: {
                            name: "No track currently playing",
                            artist: null,
                            album: null
                        },
                        currentDivice: "unknown"
                    }
                }
            }).catch((err) => {
                console.log(`erreur 'getGroupeInfo' : ${err.response.status}, ${err.response.data}`);
            });
        }
        listMembers.push(userInfo)
    }
    return listMembers
}

async function getCurrentSong({ username }) {
    const token = await refershSpotifyToken({ username: username });
    return await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status == 200) {
            return {
                context_uri: response.data.item.album.uri,
                offset: {
                    position: +response.data.item.track_number - 1
                },
                position_ms: +response.data.progress_ms
            }
        } else if (response.status == 204) {
            return null
        }
    }).catch((err) => {
        console.log(`erreur 'getCurrentSong' : ${err.response.status}, ${err.response.data}`);
        return null;
    });
}

async function synchronizeSong({ nameGroupe, dataSong }) {
    let resSync = [];
    for (const member of tool.listUsers.filter(u => u.groupe.name === nameGroupe)) {
        let memberSyc = {
            username: member.username,
            state: "Impossible pas de compte Spotify lié"
        };
        if (member.spotify.id != null) {
            const token = await refershSpotifyToken({ username: member.username });
            await axios.put('https://api.spotify.com/v1/me/player/play', dataSong, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                if (response.status === 204) {
                    memberSyc.state = "Musique synchronisée";
                }
            }).catch(err => {
                memberSyc.state = "Impossible pas de compte Spotify premium"
                console.log(`erreur 'synchronizeSong' : ${err.response.status}, ${err.response.data}`);
            });

        }
        resSync.push(memberSyc);
    }
    return resSync;
}

module.exports = {
    addMembersGroupe,
    listGroupe,
    getGroupeInfo,
    getCurrentSong,
    synchronizeSong
}