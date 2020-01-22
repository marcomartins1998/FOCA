'use strict'

require('./../../node_modules/bootstrap/dist/css/bootstrap.css')
require('./../../node_modules/bootstrap/dist/js/bootstrap.js')
const Handlebars = require('handlebars/dist/handlebars')
const util = require('./util')
const login = require('./login')
const signout = require('./signout')

const indexFOCA = require('./indexFOCA.js')
const getLeaguesList = require('./getLeaguesList.js')
const getLeagueTeams = require('./getLeagueTeams.js')
const createGroup = require('./createGroup.js')
const editGroup = require('./editGroup.js')
const getGroupsList = require('./getGroupsList.js')
const getGroup = require('./getGroup.js')
const addTeamToGroup = require('./addTeamToGroup.js')
const removeTeamFromGroup = require('./removeTeamFromGroup.js')
const getMatchesBetweenDatesFromGroup = require('./getMatchesBetweenDatesFromGroup.js')

const mainView = require('./../views/main.html')
const navbarView = Handlebars.compile(require('./../views/navbar.hbs'))

document.body.innerHTML = mainView
const divMain = document.getElementById('divMain')
const divNavbar = document.getElementById('divNavbar')

showNavbar()
    .then(() => {
        window.onload = showView
        window.onhashchange = showView
        showView()
        util.showAlert('FOCA is running', 'success')     
    })

async function showNavbar() {
    const resp = await fetch('/api/foca/auth/session')
    const body = await resp.json() // body => {auth, fullname}
    if(resp.status != 200) {
        util.showAlert(JSON.stringify(body))
    }   
    divNavbar.innerHTML = navbarView(body)
}

function showView() {
    const path = window.location.hash
    switch(path) {
        case '#indexFOCA':
            indexFOCA(divMain)
            break
        case '#login':
            login(divMain, showNavbar)
            break
        case '#signout':
            signout(showNavbar)
            break
        case '#getLeaguesList':
            getLeaguesList(divMain)
            break
        case '#getLeagueTeams':
            getLeagueTeams(divMain)
            break
        case '#createGroup':
            createGroup(divMain)
            break
        case '#editGroup':
            editGroup(divMain)
            break
        case '#getGroupsList':
            getGroupsList(divMain)
            break
        case '#getGroup':
            getGroup(divMain)
            break
        case '#addTeamToGroup':
            addTeamToGroup(divMain)
            break
        case '#removeTeamFromGroup':
            removeTeamFromGroup(divMain)
            break
        case '#getMatchesBetweenDatesFromGroup':
            getMatchesBetweenDatesFromGroup(divMain)
            break
        default:
            divMain.innerHTML = 'Resource Not Found!'
    }
    updateNav(path)
}

function updateNav(path) {
    const current = document.querySelector('a.active')
    if(current) current.classList.remove('active')
    const nav = document.getElementById('nav' + path)
    if(!nav) return
    nav.classList.add('active')
}