const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')

const app = express();

const auth = require('./routes/auth');
const employee = require('./routes/employee');

//Body parser
app.use(express.json())

//Dev logging  middleware
if(process.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


//Load env variables
dotenv.config({ path:'./config/config.env'});
connectDB();

app.use('/api/auth',  auth);

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//Hanlde unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    
    console.log(`Error ${err.msg}`.red);

    //Close server and exit process
    server.close(() => process.exit(1));
})