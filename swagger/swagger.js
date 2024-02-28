const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        title: 'Yspotify API',
        varsion: 'v0.0.1',
        description: `Yspotify API, c'est un service qui exploite l'API du géant du streaming de musique Spotify dans l'objectif d'offrir des services supplémentaires aux utilisateurs. L'API Yspotify offre aux utilisatreurs les services suivants :

            - Une inscription & connexion au service Yspotify.
            - Une possibilité de liaison d'un compte Spotify au service (pour profiter des services qui exploitent l'API de Spotify).
            - Un système de groupe permettant aux utilisateurs de créer, adhérer à un groupe.
            - Un système de création de playlists avec les musiques likées d'un membre du groupe.
            - Un système de synchronisation de la musique entre les membres d'un groupe (uniquement pour l'administrateur du groupe).
            - Un système d'analyse des musiques likées pour déduire la personnalité de l'utilisateur. 
        `
    },
    host: 'localhost:8080',
    securityDefinitions: {
        BasicAuth: {
            type: 'http',
            scheme: 'basic',
            in: 'header'
        },
        BearerAuth:
        {
            type: 'http',
            scheme: 'bearer',
            in: 'header'

        }
    }
};

const outputFile = './swagger-doc.json';
const routes = ['./index.js'];



swaggerAutogen(outputFile, routes, doc);