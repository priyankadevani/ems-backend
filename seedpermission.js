const mongoose = require('mongoose');
const Permission = require('./src/models/permission');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;



const permissions = [
    {
        name: 'employee.create',
        module: 'employee',
        action: 'create'

    },
    {
        name: 'employee.read',
        module: 'employee',
        action: 'read'
    },
    {
        name: 'employee.update',
        module: 'employee',
        action: 'update'
    },
    {
        name: 'employee.delete',
        module: 'employee',
        action: 'delete'
    }
];

const seed = async () => {
    mongoose.connect(MONGO_URI)
    await Permission.deleteMany();
    await Permission.insertMany(permissions);
    console.log('Permissions seeded');
    mongoose.connection.close();
};

seed();