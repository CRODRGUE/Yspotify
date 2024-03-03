# Projet Yspotify 

### Description

Yspotify API, c'est un service qui exploite l'API du géant du streaming de musique Spotify dans l'objectif d'offrir des services supplémentaires aux utilisateurs. L'API Yspotify offre aux utilisateurs les services suivants :  

* Une inscription & connexion au service Yspotify.
* Une possibilité de liaison d'un compte Spotify au service (pour profiter des services qui exploitent l'API de Spotify).
* Un système de groupe permettant aux utilisateurs de créer, adhérer à un groupe.
* Un système de création de playlists avec les musiques likées d'un membre du groupe.
* Un système de synchronisation de la musique entre les membres d'un groupe (uniquement pour l'administrateur du groupe).
* Un système d'analyse des musiques likées pour déduire la personnalité de l'utilisateur. 

### Guide d'installation du projet 

###### Prérequis pour l'installation du projet

Pour lancer le service Yspotify localement sur votre machine, il vous faudra avoir installé Nodejs (version v18.18.0 ou bien ultérieur). Pour l'installer suivez les instructions [ici](https://nodejs.org/en/download) 

###### Les instructions pour installer le projet

* Ouvrer un cmd, puis cloner le projet en exécutant la commande suivante :  
 `git clone https://github.com/CRODRGUE/Yspotify.git`  
* Placer vous à la racine du projet, grâce à la commande suivante :  
  `cd  /Yspotify` 
* Installer les dépendances nécessaires au projet avec la commande ci-dessous :  
` npm install `
* Mettre le fichier contenant les variables d'environnement à la racine du projet et le fichier user.json dans le dossier data (envoyé sur Teams)
* Lancer le projet en exécutant la commande ci-dessous :  
` npm run start`
* Ouvrer votre navigateur préfère puis aller l'URL suivant : `http://localhost:8080/api-docs`

**Mot de passe pour les comptes : azerty13**