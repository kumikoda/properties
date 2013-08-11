express = require 'express'
passport = require 'passport'

# Connect to DB
db = require './config/database'

# App initialization and configuration
app = express()
require('./config/express')(app)
require('./config/passport')(app,passport) 


# Mount the routes
require('./routes')(app, passport)

# Server
app.listen process.env.PORT || 3000, ->
  console.log 'APP listening on port 3000'

