express = require 'express'

# App initialization and configuration
app = express()
require('./config/express')(app)

app.get '/', (req,res) ->
  res.render 'index'

# Server
app.listen process.env.PORT || 3000, ->
  console.log 'APP listening on port 3000'

