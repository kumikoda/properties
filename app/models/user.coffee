mongoose = require('mongoose')
Schema = mongoose.Schema
bcrypt   = require('bcrypt')
SALT_WORK_FACTOR = 10;


# User Schema
userSchema = Schema (
  username    : { type: String, required: true, unique: true }
  email       : { type: String, required: true, unique: true }
  password    : { type: String, required: true}
  accessToken : { type: String } # Used for Remember Me
)

# Bcrypt middleware
userSchema.pre('save', (next) ->
  user = this;

  if !user.isModified('password') 
    return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) ->
    if (err) 
      return next(err);

    bcrypt.hash(user.password, salt, (err, hash) ->
      if(err) 
        return next(err);
      user.password = hash;
      next();
    );
  );
);

# Password verification
userSchema.methods.comparePassword = (candidatePassword, cb) ->
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) ->
    if err 
      return cb(err);
    cb(null, isMatch);
  );


# Remember Me implementation helper method
userSchema.methods.generateRandomToken = ->
  user = this
  chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  token = new Date().getTime() + '_';
  
  for i in [0..16] by 1
    i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  
  return token;


module.exports = mongoose.model('User', userSchema); 


