'use strict'

const Handlebars = require('handlebars/dist/handlebars')
const getMatcheBetweenDatesFromGroupView = require('./../views/getMatchesBetweenDatesFromGroup.html')
const getMatcheBetweenDatesFromGroupResultsTemplate = require('./../views/getMatchesBetweenDatesFromGroupResults.hbs')
const searchResults = Handlebars.compile(getMatcheBetweenDatesFromGroupResultsTemplate)
const util = require('./util.js')

module.exports = (divMain) => {
    divMain.innerHTML = getMatcheBetweenDatesFromGroupView

    document
        .getElementById('buttonSearch')
        .addEventListener('click', getMatcheBetweenDatesFromGroup)

    const groupId = document.getElementById('groupId')
    const toDate = document.getElementById('toDate')
    const fromDate = document.getElementById('fromDate')
    const divResults = document.getElementById('divResults')

    function getMatcheBetweenDatesFromGroup(ev) {
        ev.preventDefault()
        if(groupId.value.trim() && toDate.value.trim() && fromDate.value.trim()){
            fetch(`http://localhost:3000/api/foca/groups?groupid=${groupId.value}&date1=${fromDate.value}&date2=${toDate.value}`)
                .then(async resp => {
                    if(resp.status != 201 && resp.status != 200){
                        const body = await resp.json()
                        throw `${resp.status}: ${JSON.stringify(body)}`
                    }
                    else return resp
                })
                .then(resp => resp.json())
                .then(books => searchResults(books))
                .then(view => divResults.innerHTML = view)
                .catch(err => util.showAlert(err, 'danger'))
        }
        else util.showAlert("Fill in the input boxes before proceeding.", 'warning')
    }
}