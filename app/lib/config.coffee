coffeescript = require 'connect-coffee-script'
stylus = require 'stylus' 
nib = require 'nib'
express = require 'express'
flash = require 'connect-flash'

module.exports = (app) ->

  # jade 
  app.set 'views', __dirname + '/../views'
  app.set 'view engine', 'jade'

  # coffeescript
  app.use coffeescript  
    src: __dirname + '/../public'
    bare: true  

  # stylus + nib
  app.use stylus.middleware
    src: __dirname + '/../public'
    compile: (str, path) ->
      return stylus(str)
        .set('filename', path)
        .use(nib());

  # public directory
  app.use express.static __dirname + '/../public'


  app.use express.bodyParser()
  app.use express.cookieParser()
  app.use express.logger 'dev'
  app.use express.session 
    secret: 'keyboard cat'
  app.use flash()
  app.use app.router

