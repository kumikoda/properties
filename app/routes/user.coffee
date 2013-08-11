mongoose = require 'mongoose'
User = mongoose.model('User')

module.exports = (app, middleware, passport) ->
  new_user = (req, res, next) ->
    usr = new User req.body.user
    console.log usr
    usr.save (err) ->
      if err
        console.log(err)
        req.flash('error', err.message)
        res.redirect('/')
      else 
        console.log('user: ' + usr.name + " saved.")
        req.logIn usr, (err) ->
          if err 
            return next(err)
          res.redirect('/account')

  
  app.post '/user/new', new_user