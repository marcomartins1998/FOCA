'use strict'

class FocaMockFootDB{

    static getCompetitions(){
        return Promise.resolve(competition.competitions)
    }

    static getTeamsFromLeague(competitionId, callback){
        const idx = competition.competitions.findIndex(c => c.id == competitionId)
        if(idx<0) return Promise.reject({code: 404})
        const teams = competition.competitions[idx].teams
        return Promise.resolve(teams)
    }

    static getTeamMatchesBetweenDates(teamid, date1, date2, callback){
        const idx = teams.findIndex(c => c.id == teamid)
        if(idx<0) return Promise.reject({code: 404})
        let matches = teams[idx].matches

        function getTime(date){
            return new Date(date).getTime()
        }
        matches.filter(match => getTime(match.utcDate.split('T')[0]) > getTime(date1) && getTime(match.utcDate.split('T')[0]) < getTime(date2))
        return Promise.resolve(matches)
    }
   
}

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

module.exports = FocaMockFootDB