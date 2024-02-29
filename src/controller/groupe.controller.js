const service = require('../service/groupes.service');
const tool = require('../tool/data.tool');

async function JoinGroupe(req, res) {
    // #swagger.tags = ['Les groupes']
    // #swagger.security = [{"BearerAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-4), permet à un utilisateur authentifié de pouvoir adhérer à un groupe ou bien de créer un groupe si celui-ci n\'est pas déjà présent sur le service'

    // Récuperation des données nécessaires pour répondre à la demande
    let data = {
        username: res.locals.dataToken.username,
        nameGroupe: req.params.name_groupe
    }

    // Vérification des données uniquement la présence
    if (!data.username || !data.nameGroupe) {
        return res.status(400).json({ code: 400, message: 'Il manque des données pour effectuer cette demande' });
    }

    const joingroupeRes = await service.addMembersGroupe(data);
    if (joingroupeRes == null) {
        return res.status(400).json({ code: 400, message: `Échec lors de la demande d\'adhésion au groupe ${data.nameGroupe}` });
    }
    return res.status(201).json({ code: 201, message: 'Demande d\'adhésion réussie avec succès' });
}


function ListGroupe(req, res) {
    // #swagger.tags = ['Les groupes']
    // #swagger.security = [{"BearerAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-5), permet à un utilisateur authentifié de récupérer la liste des groupes actif sur le service'
    const list = service.listGroupe();
    return res.status(200).json({ code: 200, list_groupe: list })
}

async function InfoGroupe(req, res) {
    // #swagger.tags = ['Les groupes']
    // #swagger.security = [{"BearerAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-5), permet à un utilisateur authentifié de pouvoir obtenir les informations détailles si celui-ci adhérer au groupe ciblé'

    // Récuperation des données nécessaires pour répondre à la demande
    let data = {
        username: res.locals.dataToken.username,
        nameGroupe: req.params.name_groupe
    }

    // Vérification de la présence des données
    if (!data.username || !data.nameGroupe) {
        return res.status(400).json({ code: 400, message: 'Il manque des données pour effectuer cette demande' });
    }

    // Vérification de la présence de l'utilisateur dans le groupe
    let user = tool.listUsers.find(u => u.username === data.username);
    if (user.groupe.name != data.nameGroupe) {
        return res.status(403).json({ code: 403, message: 'Vous n\'êtes pas autorisé à effectuer cette demande' });
    }
    // Récupération des données concernant le groupe
    const resInfo = await service.getGroupeInfo(data);
    if (resInfo.length < 0) {
        return res.status(204).json({ code: 204, message: 'Aucune donnés' });
    }
    return res.status(200).json({ code: 200, nameGroupe: data.nameGroupe, listMembers: resInfo });
}

async function SynchronizeSongGroupe(req, res) {
    // #swagger.tags = ['Synchronisation de la musique d\'un groupe']
    // #swagger.security = [{"BearerAuth": []}]
    // #swagger.description = 'Cet endpoints (FT-7), permet à un utilisateur authentifié et qui a lié son compte Spotify de pouvoir synchroniser sa musique en cours d\'écoute avec les membre de son groupe. uniquement s\'il est admin du groupe'

    // Récuperation des données nécessaires pour répondre à la demande
    let data = {
        nameGroupe: req.params.name_groupe,
        username: res.locals.dataToken.username
    }

    // Vérification de la présence des données
    if (!data.nameGroupe || !data.username) {
        return res.status(400).json({ code: 400, message: 'Vous ne pouvez pas effectuer cette demande' });
    }

    // Vérification du rôle et 
    let user = tool.listUsers.find(u => u.username === data.username);
    // Vérification que l'utilisateur du rôle et d'adhésion au groupe
    if (!user.groupe.admin || user.groupe.name != data.nameGroupe) {
        return res.status(403).json({ code: 403, message: 'Vous n\'êtes pas autorisé à effectuer cette demande' });
    } else if (!user.spotify.id) {
        return res.status(400).json({ code: 400, message: 'Vous devez lié votre compte spotify pour effectuer cette demande' });
    }
    const dataSong = await service.getCurrentSong({ username: user.username });
    if (!dataSong) {
        return res.status(400).json({ code: 400, message: "Aucune musique en cours d'écoute" })
    }
    const resSync = await service.synchronizeSong({ nameGroupe: data.nameGroupe, dataSong: dataSong });
    res.status(200).json({ code: 200, nameGroupe: data.nameGroupe, listMembers: resSync });
}

module.exports = {
    JoinGroupe,
    ListGroupe,
    InfoGroupe,
    SynchronizeSongGroupe
}