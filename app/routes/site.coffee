module.exports = (app, middleware) ->

  index = (req,res) ->
    res.render 'index',
      title: 'Index'


  login = (req, res) ->
    res.render 'login',
      title: 'Login' 


  account = (req, res) ->
    res.render 'account',
      title: 'Account'
      user : req.user



  app.get '/', index 
  app.get '/login', login
  app.get '/account', middleware.ensureAuthenticated, account