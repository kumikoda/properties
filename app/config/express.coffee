stylus = require 'stylus' 
nib = require 'nib'
express = require 'express'
flash = require 'connect-flash'
coffeescript = require 'connect-coffee-script'

module.exports = (app) ->

  # jade 
  app.set 'views', __dirname + '/../views'
  app.set 'view engine', 'jade'

  
  # coffeescript
  app.use coffeescript  
    src: __dirname + '/../assets/src/coffee'
    dest: __dirname + '/../assets/public/js'
    bare: true  
  
  
  # stylus with nib
  app.use stylus.middleware
    src: __dirname + '/../assets/src/stylus'
    dest: __dirname + '/../assets/public/css'
    compile: (str, path) ->
      return stylus(str)
        .set('filename', path)
        .use(nib());
  

  # public directories
  app.use '/js', express.static __dirname + '/../assets/public/js'
  app.use '/css', express.static __dirname + '/../assets/public/css'
  app.use express.static __dirname + '/../assets/public/'


  app.use express.bodyParser()
  app.use express.cookieParser()
  app.use express.logger 'dev'
  app.use express.session 
    secret: 'keyboard cat'
  app.use flash()
  

