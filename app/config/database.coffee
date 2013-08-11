# Initialize the models
require './../models'

# Connnect to the database
mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/test' 