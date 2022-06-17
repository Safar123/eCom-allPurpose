const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsyncError');
const GlobalError = require('../utils/globalError');

exports.signUpUser = catchAsync(async (req,res, next)=>{
  
    const username=`${req.body.email}`.split('@')[0];
    const newUser = await User.create({
        username:username,
        email:req.body.email,
        password:req.body.password,
        confrimPassword:req.body.password,
        userImage:req.body.userImage,
        
    })
    
    if(!newUser) return next(new GlobalError('Something went wrong creating user', 500));

    res.status(201).json({
        success:'true',
        data:{
            user:newUser
        }
    })
})