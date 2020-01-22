'use strict'

const Handlebars = require('handlebars/dist/handlebars')
const getLeagueTeamsView = require('./../views/getLeagueTeams.html')
const getLeagueTeamsResultsTemplate = require('./../views/footballDataResults.hbs')
const searchResults = Handlebars.compile(getLeagueTeamsResultsTemplate)
const util = require('./util.js')

module.exports = (divMain) => {
    divMain.innerHTML = getLeagueTeamsView

    document
        .getElementById('buttonSearch')
        .addEventListener('click', getLeagueTeams)

    const inputLeague = document.getElementById('inputLeague')
    const divResults = document.getElementById('divResults')
    

    function getLeagueTeams(ev) {
        ev.preventDefault()
        if(inputLeague.value.trim()){
            ev.preventDefault()
            fetch(`http://localhost:3000/api/foca/leagues/${inputLeague.value}/teams`)
                .then(async resp => {
                    if(resp.status != 201 && resp.status != 200){
                        const body = await resp.json()
                        throw `${resp.status}: ${JSON.stringify(body)}`
                    }
                    else return resp
                })
                .then(resp => resp.json())
                .then(teams => searchResults(teams))
                .then(view => divResults.innerHTML = view)
                .catch(err => util.showAlert(err, 'danger'))
        }
        else util.showAlert("Fill in the input boxes before proceeding.", 'warning')
    }
}