middleware = require './middleware'

module.exports = (app,passport) ->

  require('./site')(app, middleware)
  require('./user')(app, middleware)
  require('./authentication')(app, passport)


  

  