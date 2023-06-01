const mongoose = require('mongoose');

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    });

    console.log(`Mongodb connected, ${conn.connection.host}`)
}

module.exports = connectDb;