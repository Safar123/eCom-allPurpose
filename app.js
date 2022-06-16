const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const GlobalError = require('./utils/globalError');

const app =express();

app.use(express.json());


//defining routes
const productRoute = require('./routes/productRoute');
app.use('/api/v1', productRoute);

//handling all unhandled error
app.all('*', (req,res,next)=>{
    const message = `${req.originalUrl} doesn't exist or not defined yet`;
    return next (new GlobalError(message, 404))
})
app.use(errorHandler);
module.exports=app;