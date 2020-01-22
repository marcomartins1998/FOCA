'use strict'

const http = require('http')
const express = require('express')
const morgan = require('morgan')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')
const bodyParser = require('body-parser')
const expressSession = require('express-session')

const footballService = require('./data/football-data')
const focadbService = require('./data/foca-db').init('http://localhost:9200/', 'foca/group')
const focaServices = require('./services/foca-services').init(footballService, focadbService)
//const focaServices = require('./services/mock-foca-services').init(footballService, focadbService)

const focaAuth = require('./auth/auth.js').init('http://localhost:9200/', 'users/user')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressSession({secret: 'YnRhcmRl', resave: false, saveUninitialized: true }))
app.use(webpackMiddleware(webpack(webpackConfig)))

const passport = require('passport')
passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser((userId, done) => focaAuth
    .getUser(userId)
    .then(user => done(null, user))
    .catch(err => done(err))
)
app.use(passport.initialize())
app.use(passport.session())

require('./web-api/auth-web-api')(app, focaAuth)
require('./web-api/foca-web-api')(app, focaServices, focaAuth)
http
    .createServer(app)
    .listen(3000, () => {
        console.log('HTTP Server listening on port 3000')
    })