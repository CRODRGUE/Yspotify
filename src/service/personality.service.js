const tool = require('../tool/data.tool');
const axios = require('axios');
const queryString = require('querystring');
const { refershSpotifyToken } = require('./link.account.service')


//https://www.pierre-giraud.com/javascript-apprendre-coder-cours/boucle-while-do-for-in/

async function getLikedSong({ token }) {
    let listIdTracks = [];
    let nextPage = "https://api.spotify.com/v1/me/tracks?limit=50";
    do {
        await axios.get(nextPage, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                response.data.items?.map(t => listIdTracks.push(t.track?.id))
                nextPage = response.data?.next
            }
        }).catch((err) => console.log('errrrrr ===> ', err.response.status))
    } while (nextPage != null);
    return listIdTracks
}


async function getDataTracks({ listIdTracks, token }) {
    let dataTracks = [];
    for (var i = 0; i < listIdTracks.length; i += 100) {
        const paquet = listIdTracks.slice(i, i + 100);
        await axios.get('https://api.spotify.com/v1/audio-features?' + queryString.stringify({ ids: paquet.join(',') }), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then((response) => {
            if (response.status === 200) {
                dataTracks.push(...response.data?.audio_features);
            }

        }).catch((err) => {
            console.log(err.response.status)
        })
    }
    return dataTracks
}

async function getPersonality({ username }) {
    let user = tool.listUsers.find(u => u.username === username);
    if (!user || !user.spotify.id) {
        return null;
    }
    const token = await refershSpotifyToken({ username: user.username });
    const listIdTracks = await getLikedSong({ token: token });
    if (!listIdTracks) {
        return null
    }

    const listDataTracks = await getDataTracks({ listIdTracks: listIdTracks, token: token });
    if (!listDataTracks) {
        return null
    }

    const listDataTracksLength = listDataTracks.length;
    let dataPersonality = {
        danceability: listDataTracks.reduce((sum, track) => sum + track.danceability, 0) / listDataTracksLength,
        tempo: listDataTracks.reduce((sum, track) => sum + track.tempo, 0) / listDataTracksLength,
        instrumentalness: listDataTracks.reduce((sum, track) => sum + track.instrumentalness, 0) / listDataTracksLength,
        valence: listDataTracks.reduce((sum, track) => sum + track.valence, 0) / listDataTracksLength,
    }

    return dataPersonality
}

module.exports = {
    getPersonality
}
