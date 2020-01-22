'use strict'

module.exports = (app, focaServices, focaAuth) => {

    app.get('/api/foca/leagues', getLeaguesList)
    app.get('/api/foca/leagues/:leagueid/teams', getLeagueTeams)
    app.post('/api/foca/groups', createGroup)
    app.put('/api/foca/groups/:groupid', editGroup)
    app.get('/api/foca/groups', getGroupList)
    app.get('/api/foca/groups/:groupid', getGroup)
    app.put('/api/foca/groups/:groupid/teams', addTeamToGroup)
    app.delete('/api/foca/groups', removeTeamFromGroup) 
    app.get('/api/foca/groups', getGamesBetweenDatesFromGroup) 
    app.use(resourceNotFound)
    app.use(errorHandler)

    function getLeaguesList(req, res, next) {
        focaServices.getCompetitions()
            .then(data => res.status(200).json(data))
            .catch(err => next(err))
    }

    function getLeagueTeams(req, res, next){
        //console.log(req.path)
        //console.log(req.method)
        focaServices.getTeams(Number(req.params.leagueid))
            .then(data => res.json(data))
            .catch(err => next(err))
    }

    function createGroup(req, res, next){
        if(!req.isAuthenticated()) return unAuthorizedAccess(next)
        focaServices.createGroup(req.body.name, req.body.description)
            .then(data => focaAuth.updateUser(req.user._id, data))
            .then(data => res.status(201).end(data))
            .catch(err => next(err))
    }

    function editGroup(req, res, next){
        if(!req.isAuthenticated()) return unAuthorizedAccess(next)
        if(!req.user.groups.some(ugid => ugid == req.params.groupid)) return unAuthorizedAccess(next)
        focaServices.editGroup(req.params.groupid, req.body.name, req.body.description)
            .then(data => res.end(data)) 
            .catch(err => next(err))
    }

    function getGroupList(req, res, next) {
        if(!req.isAuthenticated()) return unAuthorizedAccess(next)
        if(Object.keys(req.query).length !== 0) return next()
        focaServices.getAllGroups()
            .then(data => data.filter(gobj => req.user.groups.some(ugid => ugid == gobj._id)))
            .then(data => res.json(data))
            .catch(err => next(err))
    }

    function getGroup(req, res, next){
        if(!req.isAuthenticated()) return unAuthorizedAccess(next)
        if(!req.user.groups.some(ugid => ugid == req.params.groupid)) return unAuthorizedAccess(next)
        focaServices.getGroupDetails(req.params.groupid)
            .then(data => res.json(data))
            .catch(err => next(err))
    }

    function addTeamToGroup(req, res, next){
        if(!req.isAuthenticated()) return unAuthorizedAccess(next)
        if(!req.user.groups.some(ugid => ugid == req.params.groupid)) return unAuthorizedAccess(next)
        focaServices.addTeamToGroup(req.params.groupid, req.body)
            .then(data => res.end(data))
            .catch(err => next(err))
    }

    function removeTeamFromGroup(req, res, next){
        if(!req.isAuthenticated()) return unAuthorizedAccess(next)
        if(!req.user.groups.some(ugid => ugid == req.query.groupid)) return unAuthorizedAccess(next)
        focaServices.removeTeamFromGroup(req.query.groupid, Number(req.query.teamid))
            .then(data => res.end(data))
            .catch(err => next(err))
    }

    function getGamesBetweenDatesFromGroup(req, res, next){
        if(!req.isAuthenticated()) return unAuthorizedAccess(next)
        if(!req.user.groups.some(ugid => ugid == req.query.groupid)) return unAuthorizedAccess(next)
        focaServices.getMatchesBetweenDatesFromGroup(req.query.groupid, req.query.date1, req.query.date2)
            .then(data => res.json(data))
            .catch(err => next(err))
    }

}    


function resourceNotFound(req, res, next) {
    next({
        'statusCode': 404,
        'message': 'Resource Not Found'
    })
}

function unAuthorizedAccess(next){
    next({
        'statusCode': 401,
        'message': 'Unauthorized Access Detected'
    })
}

function errorHandler(err, req, res, next) {
    res.statusCode = err.statusCode
    res.json(err)
}

