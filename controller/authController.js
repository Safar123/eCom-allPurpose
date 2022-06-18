const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsyncError");
const GlobalError = require("../utils/globalError");

exports.signUpUser = catchAsync(async (req, res, next) => {
    if (!req.body.email) {
        return next(new GlobalError("Email is required field", 400));
    }
    const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
        confrimPassword: req.body.password,
        userImage: req.body.userImage,
    });

    if (!newUser)
        return next(new GlobalError("Something went wrong creating user", 500));

    res.status(201).json({
        success: "true",
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

    res.status(200).json({
        success: "True",
        data: {
            user: emailExist,
        },
    });
});
