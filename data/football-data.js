'use strict'
const rp = require('request-promise')
const uri = 'http://api.football-data.org'

const options = {
    url: '',
    headers: {
        "X-Auth-Token": "a20b8a142568412a8e6a55113dfca011",
    }
}

class FootballService {

    static getCompetitions(){
        options.url = uri + '/v2/competitions/'
        return rp.get(options)
            .then(body => JSON.parse(body).competitions.map(t=>{
                return {'id': t.id, 'name': t.name}
            }))
    }

    static getTeamsFromLeague(id){
        options.url = uri+'/v2/competitions/'+id+'/teams'
        return rp.get(options)
            .then(body => JSON.parse(body).teams.map(t=>{
                return {'id': t.id, 'name': t.name}
            }))
    }

    static getTeamMatchesBetweenDates(teamid, date1, date2, cb){
        options.url = uri+'/v2/teams/'+teamid+'/matches/'
        return rp.get(options)
            .then(body => {
                body = JSON.parse(body)

                if(body.matches === undefined) return []
                let allmatches = body.matches.filter((match) => {
                    const matchdte = match.utcDate.split("T")[0]
                    if(new Date(matchdte).getTime() > new Date(date1).getTime() && new Date(matchdte).getTime() < new Date(date2).getTime()) return true
                    else return false
                }) 
                return allmatches
            })
    }
}

module.exports = FootballService