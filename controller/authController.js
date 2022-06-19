const {promisify} = require('util');
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsyncError");
const GlobalError = require("../utils/globalError");
const jwt = require('jsonwebtoken');



const signJwtToken = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
             expiresIn:process.env.JWT_EXPIRES_IN 
})}

exports.signUpUser = catchAsync(async (req, res, next) => {
    if (!req.body.email) {
        return next(new GlobalError("Email is required field", 400));
    }
    const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
        confrimPassword: req.body.password,
        userImage: req.body.userImage,
        passwordChangedAt:req.body.passwordChangedAt
    });

    if (!newUser)
        return next(new GlobalError("Something went wrong creating user", 500));
        const token = signJwtToken(newUser._id)
    res.status(201).json({
        success: "true",
        token,
        data: {
            user: newUser,
        },
    });
});

exports.logInUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new GlobalError("Email and password is required field", 400));
    }

    const emailExist = await User.findOne({ email: email }).select("+password");

    if (
        !emailExist ||
        !(await emailExist.matchUserPassword(password, emailExist.password))
    ) {
        return next(new GlobalError("Either email or password is incorrect", 400));
    }

    // const logIntoken = jwt.sign({id:emailExist._id}, process.env.JWT_SECRET, {
    //     expiresIn:process.env.JWT_EXPIRES_IN
    // })

    const logIntoken= signJwtToken(emailExist._id)

    res.status(200).json({
        success: "true",
        logIntoken
    });
});

exports.routeProtector = catchAsync(async (req,res,next)=>{
//check if there is token available or not by setting headers
let token;
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

    token = req.headers.authorization.split(' ')[1];
    
}

if(!token){
    return next (new GlobalError('You are not logged in. Please try logging in first', 401))
}

//token verification
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

const freshUser = await User.findById(decoded.id);


//check if user still exist for token given
if(!freshUser){
    return next (new GlobalError(' No user exist for the given token.', 401))
}

//check if user have data manipulation after token being issued
if(freshUser.checkPasswordChanged(decoded.iat)){
    return next (new GlobalError('User recently change password. Log in again', 401))
};

req.user =freshUser;

//if all above information is true
next();

})