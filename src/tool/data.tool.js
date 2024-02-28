const { readFile, writeFile, readFileSync, writeFileSync } = require('fs');

const PATH_DATA_USERS = __dirname + '../../../data/user.json'
const listUsers = require(PATH_DATA_USERS);



async function WriteFileDataUser(data) {
    let errWrite = writeFileSync(PATH_DATA_USERS, data)
    if (errWrite) {
        console.log(errWrite);
        return true
    }
    return null
}

module.exports = {
    listUsers,
    WriteFileDataUser
}