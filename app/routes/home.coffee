module.exports = home = {}

home.index = (req,res) ->
  res.render 'index',
    title: 'index'
