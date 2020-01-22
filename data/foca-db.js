'use strict'
const rp = require('request-promise')

class FocaDBService {
    
    constructor(host, index){
        this.URI = host+index
        this.searchURI = host+ index.split('/')[0]
    }

    static init(host, index){ 
        return new FocaDBService(host, index)
    }

    async createGroup(name, description){
        let trueObj = {
            uri: this.URI,
            body: {
                "name" : name,
                "description" : description,
                "teams" : []
            },
            json: true
        }

        const body = await rp.post(trueObj)
        await rp.get(this.searchURI+'/_refresh')
        return body._id
    }

    getGroup(groupid){
        return rp.get(this.URI+'/'+groupid)
            .then(body => JSON.parse(body)._source)
    }

    getAllGroups(){
        return rp.get(this.searchURI+'/_refresh')
            .then(() => rp.get(this.searchURI+'/_search'))
            .then(body => JSON.parse(body).hits.hits.map(obj => {
                let fobj = obj._source
                fobj._id = obj._id
                return fobj
            }))
    }

    editGroup(groupid, newname, newdescription){
        return this.getGroup(groupid)
            .then(value => {
                return {
                    uri: this.URI+'/'+groupid,
                    body: {
                        "name": newname,
                        "description": newdescription,
                        "teams": value.teams
                    },
                    json: true
                }
            })
            .then(trueObj => rp.put(trueObj))
            .then(() => "The group has been successfully edited!")
    }

    addTeam(groupid, team){
        return this.getGroup(groupid)
            .then(value => {
                if(value.teams.some(tm => tm.name == team.name || tm.id == team.id)) return "The team already exists in this group."
                value.teams.push(team)

                let trueObj = {
                    uri: this.URI+'/'+groupid,
                    body: value,
                    json: true,
                }

                return rp.put(trueObj).then(() => "The team has been added successfully!")
            })
    }

    removeTeam(groupid, teamid){
        return this.getGroup(groupid)
            .then(value => {
                if(value.teams.every((tm) => tm.id != teamid)) return "The team doesn't exist in this group."
                value.teams = value.teams.filter((tm) => tm.id != teamid)
                
                let trueObj = {
                    uri: this.URI+'/'+groupid,
                    body: value,
                    json: true,
                }

                return rp.put(trueObj).then(() => "The team has been removed successfully!")
            })
    }

}

module.exports = FocaDBService