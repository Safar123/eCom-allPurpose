const GlobalError = require('../utils/globalError');

const handleCastErrorDB =err=>{
    const message= `Invalid ${err.path} : ${err.value}`;
    return new GlobalError(message, 400)
}

const handleDuplicateDB = err=>{
    const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0]
    const message = ` Duplicate fields value ${value}. Please use different value`;
    return new GlobalError(message, 400);
    
}

const handleValidationDB =err=>{
    const errors = Object.values(err.errors).map(el=>el.message)
    const message =` Invalid user inputs. ${errors.join('. ')}`;
    return new GlobalError(message, 400);
}
const handleInvalidJWT=()=> new GlobalError('Invalid user information. Please try logging in again', 401);
const handleExpiredToken = ()=> new GlobalError('Token has expired. Please log in again', 401)

const errorInDevelopment =(err,res)=>{
//!In development mode printing out all of the error stack
    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message: err.message,
        stack:err.stack
    })

}

const errorInProduction = (err,res)=>{
    //*Error which are predictable and pre-define
    if(err.isOperational){
            
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }


    //! Unknown error hide error details from user
    else{
        res.status(500).json({
            status:'error',
            message:'Somthing went very wrong !!!!!!!!!!!!!!!!'
        })
    }

}

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.DEV_ENV==='production'){
      
        if(err.name ==='CastError') err =handleCastErrorDB(err)

        if(err.code ===11000) err = handleDuplicateDB(err)

        if(err.name ==='ValidationError') err = handleValidationDB (err)

        if (err.name ==='JsonWebTokenError') err = handleInvalidJWT()

        if(err.name ==='TokenExpiredError') err = handleExpiredToken()
        
        errorInProduction(err,res)
    }

    else if(process.env.DEV_ENV==='development'){
        errorInDevelopment(err,res)
    }

}