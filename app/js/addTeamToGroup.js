'use strict'

const addTeamToGroupView = require('./../views/addTeamToGroup.html')
const util = require('./util.js')

module.exports = (divMain) => {
    divMain.innerHTML = addTeamToGroupView

    document
        .getElementById('buttonEdit')
        .addEventListener('click', addTeamToGroup)

    const groupId = document.getElementById('groupId')
    const inputId = document.getElementById('inputId')    
    const inputName = document.getElementById('inputName')
    const divResults = document.getElementById('divResults')

    function addTeamToGroup(ev) {
        ev.preventDefault()
        if(inputId.value.trim() && inputName.value.trim()){
            let obj = {
                'id': inputId.value,
                'name': inputName.value
            }
            fetchData(`http://localhost:3000/api/foca/groups/${groupId.value}/teams`, obj, "PUT", "application/json")
                .then(async resp => {
                    if(resp.status != 201 && resp.status != 200){
                        const body = await resp.json()
                        throw `${resp.status}: ${JSON.stringify(body)}`
                    }
                    else return resp
                })
                .then(resp => resp.text())
                .then(ans_id => divResults.innerHTML = ans_id)
                .catch(err => util.showAlert(err, 'danger'))
        }
        else util.showAlert("Fill in the input boxes before proceeding.", 'warning')
    }

    function fetchData(url, data, method, content_type) {
        return fetch(url, {
            method: method,
            headers: {
                "Content-Type": content_type,
            },
            body: JSON.stringify(data)
        })
    }
}