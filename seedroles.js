const mongoose = require('mongoose');
const Role = require('./src/models/role');
const Permission = require('./src/models/permission');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI);


const seedRoles = async () => {
    // Get all permissions
    const permissions = await Permission.find();

    // Find specific permissions
    const employeeCreate = permissions.find(
        p => p.name === 'employee.create'
    );

    const employeeRead = permissions.find(
        p => p.name === 'employee.read'
    );

    const employeeUpdate = permissions.find(
        p => p.name === 'employee.update'
    );

    const employeeDelete = permissions.find(
        p => p.name === 'employee.delete'
    );

    // Delete old roles (optional for fresh setup)
    await Role.deleteMany();

    // Create Admin role
    await Role.create({
        roleName: 'Admin',
        permissions: [
            employeeCreate._id,
            employeeRead._id,
            employeeUpdate._id,
            employeeDelete._id
        ]
    });

    // Create Manager role
    await Role.create({
        roleName: 'Manager',
        permissions: [
            employeeRead._id,
            employeeUpdate._id
        ]
    });

    // Create Employee role
    await Role.create({
        roleName: 'Employee',
        permissions: [
            employeeRead._id
        ]
    });



    console.log('Roles seeded successfully');
    mongoose.connection.close();
};

seedRoles();