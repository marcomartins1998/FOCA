'use strict'

class FinalService{

    constructor(footballsrvc, focasrvc){
        this.footballService = footballsrvc
        this.focaService = focasrvc
    }

    static init(footballsrvc, focasrvc){ 
        return new FinalService(footballsrvc, focasrvc)
    }

    getCompetitions(){
        let comps = competition.competitions
        return Promise.resolve(comps.map(comp =>{
            return {
                "id": comp.id,
                "name": comp.name
            }
        }))
    }

    getTeams(competitionId){
        const idx = competition.competitions.findIndex(c => c.id == competitionId)
        if(idx<0) return Promise.reject({code: 404})
        const teams = competition.competitions[idx].teams
        return Promise.resolve(teams.map(t =>{
            return {
                "id": t.id,
                "name": t.name
            }
        }))
    }

    createGroup(name, description){
        let group = {
            'name': name,
            'description': description,
            'teams': []
        }

        foca[count] = group
        let data = ""+count+""
        count++
        return Promise.resolve(data)
    }

    editGroup(groupId, newName, newDescription){
        const group = foca[groupId]
        if(!group) return Promise.reject({code:404})
        group.name = newName
        group.description = newDescription
        foca[groupId] = group 
        return Promise.resolve("The group has been successfully edited!")
    }

    getAllGroups(){
        return Promise.resolve(foca.map((groupobj, idx) => {
            groupobj._id = idx
            return groupobj
        }))
        //return Promise.resolve(foca)
    }

    getGroupDetails(groupid){
        const group = foca[groupid]
        if(!group) return Promise.reject({code:404})
        const data = group
        return Promise.resolve(data)
    }

    addTeamToGroup(groupid, team){
        const group = foca[groupid]
        if(!group) return Promise.reject({code:404})
        const idx = group.teams.findIndex(t=> t.id == team.id)
        if(idx>0){
            return Promise.resolve("The team already exists in this group.")
        }
        group.teams.push(team)
        return Promise.resolve("The team has been added successfully!")
    }

    removeTeamFromGroup(groupid, teamid){
        const group = foca[groupid]
        if(!group) return Promise.reject({code:404})
        const idx = group.teams.findIndex(t=> t.id == teamid)
        if(idx<0){
            return Promise.resolve("The team doesn't exist in this group.")
        }

        delete group.teams[idx]
        return Promise.resolve("The team has been removed successfully!")
    }

    getMatchesBetweenDatesFromGroup(groupid, date1, date2){
        return this.getGroupDetails(groupid)
            .then(value => {
                if(value.teams.length == 0) return Promise.resolve([])
                let arrmatches = []
                value.teams.forEach((team, idx) => {
                    const auxidx = teams.findIndex(c => c.id == team.id)
                    if(auxidx<0) return Promise.reject({code: 404})
                    let matches = teams[auxidx].matches

                    function getTime(date){
                        return new Date(date).getTime()
                    }
                    matches.filter(match => getTime(match.utcDate.split('T')[0]) > getTime(date1) && getTime(match.utcDate.split('T')[0]) < getTime(date2))
                    arrmatches.push(matches)

                    if(idx == value.teams.length-1) {
                        let auxarr = [].concat.apply([], arrmatches)
                        if(auxarr.length == 0 || auxarr.length == 1) return Promise.resolve(auxarr)
                        
                        auxarr.sort((match1, match2) => {
                            return (new Date(match1.utcDate.split('T')[0]).getTime()-new Date(match2.utcDate.split('T')[0]).getTime())
                        })
                        return Promise.resolve(auxarr)
                        
                    } 
                })
            })
    }
}

/**
 * simultates the foca index
 */
const foca = []
let count = 0

/**
* simulates the competitions of the football-data-api
*/

const competition = {
    "count":3,
    "competitions": [
        {
            "id": 2017,
            "name": "WC Qualification",
            'teams': [
                {"id": 5530, "name": "Rio Ave FC"},
                {"id": 1903, "name": "Sport Lisboa e Benfica"}
            ]
        },

        {
            "id": 2015,
            "name": "Supercopa Argentina",
            'teams':[
                {"id": 511, "name": "Toulouse FC"},
                {"id": 516, "name": "Olympique de Marseille"}
            ]
        },
        {
            "id": 2021,
            "name": "Primera B Nacional",
            "teams": [
                {"id": 57, "name": "Arsenal FC"},
                {"id": 61, "name": "Chelsea FC"}
            ]
        },
        {
            "id": 2000,
            "name": "FIFA World Cup",
            "teams": [
                {"id": 758, "name": "Uruguay"},
                {"id": 6674, "name": "Germany"},
                {"id": 6677, "name": "Spain"},
                {"id": 762, "name": "Argentina"},
                {"id": 764, "name": "Brazil"},
                {"id": 6675, "name": "Portugal"},
                {"id": 18, 
                "name": "Borussia Mönchengladbach",
                "matches": [
                    {"id": 20111,
                    "utcDate": "2018-05-17T15:00:00Z"
                    },
                    {"id": 20100,
                    "utcDate": "2018-03-11T15:00:00Z"
                    },
                    {"id": 20098,
                    "utcDate": "2018-01-19T15:00:00Z"
                    }
                ]}
            ]
        }
    ]
}

/**
* simulates a competition teams of football-data-api
*/

const teams = [
    {"id": 758, "name": "Uruguay", "matches": []},
    {"id": 6674, "name": "Germany", "matches": []},
    {"id": 6677, "name": "Spain", "matches": []},
    {"id": 762, "name": "Argentina", "matches": []},
    {"id": 764, "name": "Brazil", "matches": []},
    {"id": 6675, "name": "Portugal", "matches": []},
    {"id": 18, 
    "name": "Borussia Mönchengladbach",
    "matches": [
        {"id": 20097,
        "utcDate": "2018-02-17T15:00:00Z"
        },
        {"id": 20100,
        "utcDate": "2018-03-11T15:00:00Z"
        },
        {"id": 20111,
        "utcDate": "2018-05-19T15:00:00Z"
        }
    ]}
]


module.exports = FinalService