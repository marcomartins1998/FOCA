'use strict'

const removeTeamFromGroupView = require('./../views/removeTeamFromGroup.html')
const util = require('./util.js')

module.exports = (divMain) => {
    divMain.innerHTML = removeTeamFromGroupView

    document
        .getElementById('buttonDelete')
        .addEventListener('click', removeTeamFromGroup)

    const groupId = document.getElementById('groupId')    
    const teamId = document.getElementById('teamId')
    const divResults = document.getElementById('divResults')

    function removeTeamFromGroup(ev) {
        ev.preventDefault()
        if(groupId.value.trim() && teamId.value.trim()){
            fetchDeleteData(`http://localhost:3000/api/foca/groups?groupid=${groupId.value}&teamid=${teamId.value}`)
                .then(async resp => {
                    if(resp.status != 201 && resp.status != 200){
                        const body = await resp.json()
                        throw `${resp.status}: ${JSON.stringify(body)}`
                    }
                    else return resp
                })
                .then(resp => resp.text())
                .then(ans => divResults.innerHTML = ans)
                .catch(err => util.showAlert(err, 'danger'))
        }
        else util.showAlert("Fill in the input boxes before proceeding.", 'warning')
    }

    function fetchDeleteData(url) {
        return fetch(url, {
            method: "DELETE"
        })
    }
}