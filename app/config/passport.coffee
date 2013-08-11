LocalStrategy = require('passport-local').Strategy
mongoose = require 'mongoose' 
User = mongoose.model 'User'

module.exports = (app, passport) ->
  passport.serializeUser (user, done) ->
    createAccessToken = ->
      token = user.generateRandomToken()
      User.findOne { accessToken: token }, (err, existingUser) ->
        if err 
          return done( err )

        if existingUser 
          createAccessToken() # Run the function again - the token has to be unique!
        
        else 
          user.set 'accessToken', token 
          user.save (err) ->
            if err 
              return done(err)

            return done(null, user.get('accessToken'))
          
    if user._id 
      createAccessToken()
    
  

  passport.deserializeUser (token, done) ->
    User.findOne {accessToken: token } , (err, user) ->
      done(err, user)
    
  

  passport.use new LocalStrategy (username, password, done) ->
    User.findOne { username: username }, (err, user) ->
      if err 
        return done err 
      if !user 
        return done null, false, { message: 'Unknown user ' + username } 
      
      user.comparePassword password, (err, isMatch) ->
        if err 
          return done err 
        
        if isMatch 
          return done null, user 
        else 
          return done null, false, { message: 'Invalid password' } 
        
  rememberMe = (req, res, next) ->
    if req.method == 'POST' and req.url == '/login'
      req.session.cookie.maxAge = 2592000000 # 30*24*60*60*1000 Rememeber 'me' for 30 days
    
    next()
    

    
  app.use passport.initialize()
  app.use passport.session()
  app.use rememberMe
  app.use app.router
    