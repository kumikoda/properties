mongoose = require 'mongoose'
User = mongoose.model('User')

module.exports = (app, passport) ->

  login = (req, res, next) ->
    passport.authenticate('local', (err, user, info) ->

      if err
        console.log 'login err'
        return next(err) 
      if !user
        console.log 'user not found'
        req.session.messages =  [info.message]
        return res.redirect('/')
      
      req.logIn(user, (err) ->
        if err
          console.log 'error'
          return next(err) 
        console.log 'no error'
        return res.redirect('/account')
      )
    )(req, res, next) 

  logout = (req, res) ->
    req.logout()
    res.redirect '/'
        
  app.post '/login', login
  app.post '/logout', logout