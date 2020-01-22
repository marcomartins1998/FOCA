'use strict'

const editGroupView = require('./../views/editGroup.html')
const util = require('./util.js')

module.exports = (divMain) => {
    divMain.innerHTML = editGroupView

    document
        .getElementById('buttonEdit')
        .addEventListener('click', editGroup)

    const groupId = document.getElementById('groupId')    
    const inputName = document.getElementById('inputName')
    const inputDescription = document.getElementById('inputDescription')
    const divResults = document.getElementById('divResults')

    function editGroup(ev) {
        ev.preventDefault()
        if(groupId.value.trim() && inputName.value.trim() && inputDescription.value.trim()){
            let obj = {
                'name': inputName.value,
                'description': inputDescription.value
            }
            fetchData(`http://localhost:3000/api/foca/groups/${groupId.value}`, obj, "PUT", "application/json")
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