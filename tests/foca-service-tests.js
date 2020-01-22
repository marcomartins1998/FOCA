const footballService = require('./../data/football-data')
const focadbService = require('./../data/foca-db').init('http://localhost:9200/', 'foca/group')
//const footballService = require('./../data/mock-football-data')
//const focadbService = require('./../data/mock-foca-db').init('http://localhost:9200/', 'foca/group')
const focaServices = require("./../services/foca-services").init(footballService, focadbService)
const assert = require('assert')

describe('foca-services', () => {
    let special_id
    let groupname
    let groupdescription

    it('Testing getCompetitions.', done => {
        let leagues = ["WC Qualification", "Supercopa Argentina", "Primera B Nacional"]
        focaServices.getCompetitions()
            .then(value => {
                assert.equal(true, leagues.every(league => value.map(comp => comp.name).includes(league)))
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

    it('Testing getTeams.', done => {
        let teams = ["Uruguay", "Germany", "Spain", "Argentina", "Brazil", "Portugal"]
        focaServices.getTeams(2000)
            .then(value => {
                assert.equal(true, teams.every(team => value.map(tm => tm.name).includes(team)))
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

    it('Testing createGroup.', done => {
        groupname = "Grupo Universal"
        groupdescription = "Grupo composto por varias equipas de variados paises"
        focaServices.createGroup(groupname, groupdescription)
            .then(value => {
                special_id = value
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

    it('Testing editGroup.', done => {
        groupname = "Grupo Universal [atualizado]"
        groupdescription = "Grupo composto por varias equipas de variados paises [atualizado]"
        focaServices.editGroup(special_id, groupname, groupdescription)
            .then(value => {
                assert.equal("The group has been successfully edited!", value)
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

    it('Testing getAllGroup.', done => {
        focaServices.getAllGroups()
            .then(value => {
                assert.equal(true, value.some(group => group.name == groupname && group.description == groupdescription))
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

    it('Testing getGroupDetails.', done => {
        focaServices.getGroupDetails(special_id)
            .then(value => {
                assert.equal(value.name, groupname)
                assert.equal(value.description, groupdescription)
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

    it('Testing addTeamToGroup.', done => {
        let teamobj  = {
            id: 18,
            name: "Borussia Mönchengladbach"
        }
        focaServices.addTeamToGroup(special_id, teamobj)
            .then(value => {
                assert.equal(true, (value == "The team already exists in this group." || value == "The team has been added successfully!"))
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

    it('Testing getMatchesBetweenDatesFromGroup.', done => {
        focaServices.getMatchesBetweenDatesFromGroup(special_id, "2015-5-17", "2018-8-30")
            .then(value => {
                let auxDate = 0
                assert.equal(true,(value.length == 0 || value.every(match => {
                    const lastDate = auxDate
                    auxDate = new Date(match.utcDate.split('T')[0]).getTime()
                    return (auxDate > lastDate) ? true : false
                })))
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

    it('Testing removeTeamFromGroup.', done => {
        focaServices.removeTeamFromGroup(special_id, 18)
            .then(value => {
                assert.equal(true, (value == "The team doesn't exist in this group." || value == "The team has been removed successfully!"))
                done()
            })
            .catch(err => {
                assert.fail(err)
            })
    })

})
