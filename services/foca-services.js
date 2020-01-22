'use strict'

class FinalService{

    constructor(footballsrvc, focasrvc){
        this.footballService = footballsrvc
        this.focaService = focasrvc
    }

    static init(footballsrvc, focasrvc){ 
        return new FinalService(footballsrvc, focasrvc)
    }

    getCompetitions(){return this.footballService.getCompetitions()}

    getTeams(id){return this.footballService.getTeamsFromLeague(id)}

    createGroup(name, description){return this.focaService.createGroup(name, description)}

    editGroup(groupid, newname, newdescription){return this.focaService.editGroup(groupid, newname, newdescription)}

    getAllGroups(){return this.focaService.getAllGroups()}

    getGroupDetails(groupid){return this.focaService.getGroup(groupid)}

    addTeamToGroup(groupid, teamobj){return this.focaService.addTeam(groupid, teamobj)}
    
    removeTeamFromGroup(groupid, teamid){return this.focaService.removeTeam(groupid, teamid)}

    getMatchesBetweenDatesFromGroup(groupid, date1, date2){
        return this.focaService.getGroup(groupid)
            .then(value => {
                if(value.teams.length == 0) return []
                else {
                    let functionarr = []
                    value.teams.forEach((team) => {
                        functionarr.push(this.footballService.getTeamMatchesBetweenDates(team.id, date1, date2))
                    })
                    return Promise.all(functionarr)
                }
            })
            .then(val => {
                let auxarr = [].concat.apply([], val)
                if(!(auxarr.length == 0 || auxarr.length == 1)) {
                    auxarr.sort((match1, match2) => {
                        return (new Date(match1.utcDate.split('T')[0]).getTime()-new Date(match2.utcDate.split('T')[0]).getTime())
                    })
                }
                return auxarr
            })

    }
}


module.exports = FinalService