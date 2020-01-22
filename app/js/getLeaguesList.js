'use strict'

const Handlebars = require('handlebars/dist/handlebars')
const getLeaguesListView = require('./../views/getLeaguesList.html')
const getLeaguesListResultsTemplate = require('./../views/footballDataResults.hbs')
const searchResults = Handlebars.compile(getLeaguesListResultsTemplate)

module.exports = (divMain) => {
    divMain.innerHTML = getLeaguesListView

    document
        .getElementById('buttonRefresh')
        .addEventListener('click', getLeaguesList)

    const divResults = document.getElementById('divResults')

    function getLeaguesList(ev) {
        ev.preventDefault()
        fetch('http://localhost:3000/api/foca/leagues')
            .then(resp => resp.json())
            .then(leagues => searchResults(leagues))
            .then(view => divResults.innerHTML = view)
    }
}