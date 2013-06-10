express = require 'express'

# App initialization and configuration
app = express()

require('./lib/database')
require('./lib/config')(app)
require('./lib/authentication')(app)

# Mount the routes
require('./routes')(app)

# Server
app.listen process.env.PORT || 3000, ->
  console.log 'APP listening on port 3000'

