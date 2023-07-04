const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env variables

dotenv.config({ path: './config/config.env' });

//Load models
const User = require('./models/User');
const Employee = require('./models/Employee');
const Game = require('./models/Game');
const Customer = require('./models/Customer');

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

//Read JSON files
const employees = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/employees.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const games = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/games.json`, 'utf-8')
);

const customers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/customers.json`, 'utf-8')
);

//Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Employee.create(employees);
    await Game.create(games);
    await Customer.create(customers);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Employee.deleteMany();
    await Game.deleteMany();
    await Customer.deleteMany();
    console.log('Data destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
