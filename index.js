// version Deploy Dev = 1.0.1
// version Deploy Stg = 1.0.1
// version Deploy Prd = 1.0.2
const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.options('*', cors())

const {JwtFilter} = require('./helpers/JwtUtil')
const tlmSearchDokterController = require('./controllers/tlmSearchDokterController.js')
var ctrl = new tlmSearchDokterController()

app.get('/', JwtFilter, ctrl.doSearch)

exports.tlmGetDokter = app
