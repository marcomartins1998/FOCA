'use strict'
const footballService = require('./../data/football-data')
const focadbService = require('./../data/foca-db').init('http://localhost:9200/', 'foca/group')
const focaServices = require('./../services/foca-services').init(footballService, focadbService)
const focaAuth = require('./../auth/auth.js').init('http://localhost:9200/', 'users/user')

async function injectTestData(){
    const user = await focaAuth.createUser('testfullname','testusername','testpassword')
    const groupid1 = await focaServices.createGroup("testgroup1","1st group used for testing purposes.")
    await focaServices.addTeamToGroup(groupid1, {"id": 496, "name": "Rio Ave FC"})
    await focaServices.addTeamToGroup(groupid1, {"id": 498, "name": "Sporting Clube de Portugal"})
    const groupid2 = await focaServices.createGroup("testgroup2","2nd group used for testing purposes.")
    await focaServices.addTeamToGroup(groupid2, {"id": 503, "name": "FC Porto"})
    await focaServices.addTeamToGroup(groupid2, {"id": 583, "name": "Moreirense FC"})
    const groupid3 = await focaServices.createGroup("testgroup3","3rd group used for testing purposes.")
    await focaServices.addTeamToGroup(groupid3, {"id": 810, "name": "Boavista FC"})
    await focaServices.addTeamToGroup(groupid3, {"id": 1049, "name": "CD Tondela"})

    await focaAuth.updateUser(user._id, groupid1)
    await focaAuth.updateUser(user._id, groupid2)
    await focaAuth.updateUser(user._id, groupid3)
    console.log("Test data injection complete.")
}

injectTestData()