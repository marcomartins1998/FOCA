'use strict'

const util = require('./util.js')

module.exports = async (getAuthAndInsertNavbar) => {
    //logoutHander()
    //async function logoutHander(){
        const url = 'http://localhost:3000/api/foca/auth/logout'
        const options = {
            method: 'DELETE'
        }
        const resp = await fetch(url, options)
        try{
            if(resp.status == 200){
                await getAuthAndInsertNavbar()
                window.location.hash = '#indexFOCA'
            } else {
                const body = await resp.json()
                util.showAlert(`${resp.status} ${resp.statusText}: ${JSON.stringify(body)}`)
            }    
        } catch(err){
            util.showAlert(JSON.stringify(err))
        }
    //}
}