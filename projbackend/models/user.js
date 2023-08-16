var mongoose = require("mongoose")
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength:32,
        trim: true
    },
    lastname:{
        type: String,
        maxlength: 32,
        trim: true
    },
    email:{
        type:String,
        trim: true,
        required: true,
        unique: true
    },
    userinfo:{
        type: String,
        trim: true
    },

    // todo come back here
    encry_password:{
       type:String,
       required: true
    },
    salt: String,
    role:{
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
  }, {timestamps: true});

// virtual fields
userSchema.virtual("password")
  .set(function(password){
    this._password = password
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function(){
    return this._password;
  })

  // creating methods
  userSchema.methods = {
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },
    securePassword: function(plainpassword){
        if(!plainpassword) return "";// if there is no password return nothing
        try{
            return crypto
            .createHmac("sha256", this.salt)
            .update(plainpassword)
            .digest("hex");
        } catch(err){
            return "";
        }

    }
  }


  module.exports = mongoose.model("User", userSchema);