'use strict'

const rp = require('request-promise')

class FocaAuth{

    constructor(host, index){
        this.usersUrl = host+index
        this.usersRefresh = host+index.split('/')[0]+'/_refresh'
    }

    static init(host, index){ 
        return new FocaAuth(host, index)
    }

    async createUser(fullname, username, password) {
        const user = {
            'fullname': fullname,
            'username': username,
            'password': password,
            'groups': []
        }
        const options = {
            'url': this.usersUrl,
            'json': true,
            'body': user
        }
        const resp = await rp.post(options)
        await rp.post(this.usersRefresh)
        user._id = resp._id
        return user
    }

    async updateUser(userId, groupid){
        let body = await this.getUser(userId)
        body.groups.push(groupid)
        delete body._id
        const options = {
            'url': `${this.usersUrl}/${userId}`,
            'json': true,
            'body': body
        }
        await rp.put(options)
        return groupid
    }

    async getUser(userId) {
        let body = await rp.get(`${this.usersUrl}/${userId}`)
        body = JSON.parse(body)
        return {
            '_id': body._id,
            'fullname': body._source.fullname,
            'username': body._source.username,
            'password': body._source.password,
            'groups': body._source.groups
        }
    }

    async authenticate(username, password) {
        const url = `${this.usersUrl}/_search?q=username:${username}`
        const body = await rp.get(url)
        const obj = JSON.parse(body)
        if(obj.hits.hits.length == 0) 
            throw {'statusCode': 404, 'err': 'Username not found!' }
        const first = obj.hits.hits[0]
        if(first._source.password != password) 
            throw {'statusCode': 401, 'err': 'Wrong credentials!' }
        return {
            '_id': first._id
        }
    }
}

module.exports = FocaAuth