const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        
    },
    email:{
        type:String,
        required:[true, 'Please provide valid email information'],
        validate: [validator.isEmail, 'Please provide valid email'],
        trim:true,
        unique:[true, 'Email already exist please try log in or register with new email'],
        lowercase:true,
    },

    password:{
        type:String,
        required:[true, 'Password is required and must be 8 character long'],
        trim:true,
        minlength:[8, 'Password must be 8 character long']
    },

    confirmPassword:{
        type:String,
        validate:{
  validator:function(el){
    return el ===this.password
  }
        },
        message:'Password field did not match'
    },

    userImage:{
        type:String,
    },

    role:{
        type:String,
        enum:['user', 'admin', 'super-admin'],
        default:'user'
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next;
    this.password= await bcrypt.hash(this.password, 12);
    this.confirmPassword=undefined;
})

const User = mongoose.model('User', userSchema);

module.exports= User;