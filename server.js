const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const auth = require('./routes/auth');
const employee = require('./routes/employees');
const customer = require('./routes/customers');
const games = require('./routes/games');
const users = require('./routes/users');

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Dev logging  middleware
if (process.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

//Load env variables
dotenv.config({ path: './config/config.env' });
connectDB();

app.use('/api/auth', auth);
app.use('/api/employees', employee);
app.use('/api/customers', customer);
app.use('/api/games', games);
app.use('/api/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Hanlde unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.msg}`.red);

  //Close server and exit process
  server.close(() => process.exit(1));
});
