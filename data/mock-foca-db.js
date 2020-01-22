'use strict'

class FocaMock{

    constructor(host, index){
        this.URI = host+index
    }

    static init(host, index){ 
        return new FocaMock(host, index)
    }

    createGroup(name, description){
        let group = {
            'name': name,
            'description': description,
            'teams': []
        }

        foca[count] = group
        let data = count
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

    getGroup(groupid){
        const group = foca[groupid]
        if(!group) return Promise.reject({code:404})
        const data = group
        return Promise.resolve(data)
    }

    getAllGroups(){
        return Promise.resolve(foca.map((groupobj, idx) => {
            groupobj._id = idx
            return groupobj
        }))
        //return Promise.resolve(foca)
    }

    addTeam(groupid, team){
        const group = foca[groupid]
        if(!group) return Promise.reject({code:404})
        const idx = group.teams.findIndex(t=> t.id == team.id)
        if(idx>0){
            return Promise.resolve("The team already exists in this group.")
        }
        group.teams.push(team)
        return Promise.resolve("The team has been added successfully!")
    }

    removeTeam(groupid, teamid, cb){
        const group = foca[groupid]
        if(!group) return Promise.reject({code:404})
        const idx = group.teams.findIndex(t=> t.id == teamid)
        if(idx<0){
            return Promise.resolve("The team doesn't exist in this group.")
        }

        delete group.teams[idx]
        return Promise.resolve("The team has been removed successfully!")
    }

}

/**
 * simultates the foca index
 */
const foca = []
let count = 0

module.exports= FocaMock;