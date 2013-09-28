stylus = require 'stylus' 
nib = require 'nib'
express = require 'express'
coffeescript = require 'connect-coffee-script'

module.exports = (app) ->

  # jade 
  app.set 'views', __dirname + '/../views'
  app.set 'view engine', 'jade'

  
  # coffeescript
  app.use coffeescript  
    src: __dirname + '/../app/src/'
    dest: __dirname + '/../app/public/'
    bare: true  
  
  
  # stylus with nib
  app.use stylus.middleware
    src: __dirname + '/../app/src/'
    dest: __dirname + '/../app/public/'
    compile: (str, path) ->
      return stylus(str)
        .set('filename', path)
        .use(nib());
  

  # public directory
  app.use express.static __dirname + '/../app/public'

  app.use express.bodyParser()
  app.use express.cookieParser()
  app.use express.logger 'dev'
  

