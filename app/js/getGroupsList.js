'use strict'

const Handlebars = require('handlebars/dist/handlebars')
const getGroupsListView = require('./../views/getGroupsList.html')
const getGroupsListResultsTemplate = require('./../views/getGroupsListResults.hbs')
const searchResults = Handlebars.compile(getGroupsListResultsTemplate)
const util = require('./util.js')

module.exports = (divMain) => {
    divMain.innerHTML = getGroupsListView

    document
        .getElementById('buttonRefresh')
        .addEventListener('click', getGroupsList)

    const divResults = document.getElementById('divResults')

    function getGroupsList(ev) {
        ev.preventDefault()
        fetch('http://localhost:3000/api/foca/groups')
            .then(async resp => {
                if(resp.status != 201 && resp.status != 200){
                    const body = await resp.json()
                    throw `${resp.status}: ${JSON.stringify(body)}`
                }
                else return resp
            })
            .then(resp => resp.json())
            .then(groups => {
                if(groups.length == 0) return 'No groups have been created.'
                return searchResults(groups.map(obj => {
                    if(obj.teams.length === 0) obj.teams = 'No teams have been added.'
                    else obj.teams = obj.teams.map(teamobj => JSON.stringify(teamobj))
                    return obj
                }))
            })
            .then(view => divResults.innerHTML = view)
            .catch(err => util.showAlert(err, 'danger'))
    }
}