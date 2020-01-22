'use strict'

module.exports = (app, focaAuth) => {
    app.get('/api/foca/auth/session', getSession)
    app.post('/api/foca/auth/login', login)
    app.delete('/api/foca/auth/logout', logout)
    app.post('/api/foca/auth/signup', signup)
    app.use(errorHandler)

    function getSession(req, resp, next) {
        const fullname = req.isAuthenticated() ? req.user.fullname : undefined
        resp.json({
            'auth': req.isAuthenticated(), // <=> req.user != undefined
            'fullname': fullname
        })
    }

    function login(req, resp, next) {
        focaAuth
            .authenticate(req.body.username, req.body.password)
            .then(user => {
                req.login(user, (err) => {
                    if(err) next(err)
                    else resp.json(user)
                })
            })
            .catch(err => next(err))
    }

    function logout(req, resp, next) {
        req.logout()
        resp.end("User logout successfull.")
    }

    function signup(req, resp, next) {
        focaAuth
            .createUser(req.body.fullname, req.body.username, req.body.password)
            .then(user => {
                req.login(user, (err) => {
                    if(err) next(err)
                    else resp.json(user)
                })
            })
            .catch(err => next(err))
    }

    function errorHandler(err, req, res, next) {
        res.statusCode = err.statusCode
        res.json(err)
    }
}