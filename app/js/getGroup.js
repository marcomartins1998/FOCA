'use strict'

const Handlebars = require('handlebars/dist/handlebars')
const getGroupView = require('./../views/getGroup.html')
const getGroupResultsTemplate = require('./../views/getGroupResults.hbs')
const searchResults = Handlebars.compile(getGroupResultsTemplate)
const util = require('./util.js')

module.exports = (divMain) => {
    divMain.innerHTML = getGroupView

    document
        .getElementById('buttonSearch')
        .addEventListener('click', getGroup)
    
    const inputId = document.getElementById('groupId')
    const divResults = document.getElementById('divResults')
    const divName = document.getElementById('divName')
    const divDescription = document.getElementById('divDescription')
    const divTeams = document.getElementById('divTeams')

    function getGroup(ev) {
        ev.preventDefault()
        if(inputId.value.trim()){
            fetch(`http://localhost:3000/api/foca/groups/${inputId.value}`)
            .then(async resp => {
                if(resp.status != 201 && resp.status != 200){
                    const body = await resp.json()
                    throw `${resp.status}: ${JSON.stringify(body)}`
                }
                else return resp
            })
            .then(resp => resp.json())
            .then(group => {
                if(group.teams.length === 0) group.teams = 'No teams have been added.'
                else group.teams = JSON.stringify(group.teams)
                return searchResults(group)
            })
            .then(view => divResults.innerHTML = view)
            .catch(err => util.showAlert(err, 'danger'))
        }
        else util.showAlert("Fill in the input boxes before proceeding.", 'warning')
    }
}