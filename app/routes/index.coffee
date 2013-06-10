# In this file we declare all the routes
home = require './home'

module.exports = (app) ->
  app.get '/', home.index  
