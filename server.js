const app = require('./app');
const dotenv = require('dotenv');
const dbConnection = require('./config/database');


dotenv.config({path:'./config/config.env'})
dbConnection();
const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`App running on ${port} in ${process.env.DEV_ENV}`)
})