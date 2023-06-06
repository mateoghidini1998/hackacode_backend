const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({ path: './config/config.env' });

//Load models
const User = require('./models/User');
const Employee = require('./models/Employee');

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
});
 
//Read JSON files

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const employees = JSON.parse(fs.readFileSync(`${__dirname}/_data/employees.json`, 'utf-8'));

//Import data into DB

const importData = async () => {
    try {
        await User.create(users);
        await Employee.create(employees);

        console.log('Data imported...'.green.inverse);
        process.exit(); 
    } catch (error) {
        console.error(error);
    }
    
}

const deleteData = async () => {
    try {
        await User.deleteMany(users);
        await Employee.deleteMany(employees);

        console.log('Data deleted...'.red.inverse);
        process.exit(); 
    } catch (error) {
        console.error(error);
    }
    
}

if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();l
}