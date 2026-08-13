const Employee = require("../models/employee");
const mongoose = require("mongoose");
const user = require("../models/user");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const Departmen = require("../models/department");

const getAll = async (req, res) => {
    const search = req.query.search;
    // console.log("Search:", search);
    let sort = req.query.sort || '-createdAt';
    if (sort.startsWith('-')) {
        sort = sort.slice(1);
        sort = { [sort]: -1 };
    } else {
        sort = { [sort]: 1 };
    }
    const { page, limit } = req.query;
    const pageNumber = Number(page || 1);
    const limitNumber = Number(limit || 10);
    const skip = (pageNumber - 1) * limitNumber;


    const pipeline = [
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "users"
            }
        },
        {
            $unwind: {
                path: "$users",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "department"
            }
        },
        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                "users.isActive": true
            }
        },
        {
            $addFields: {
                fullName: {
                    $concat: ["$firstName", " ", "$lastName"]
                }
            }
        }
    ];

    if (search) {
        pipeline.push(


            {
                $match: {
                    $or: [
                        {
                            fullName: {
                                $regex: search,
                                $options: "i"
                            }
                        },
                        {
                            "users.email": {
                                $regex: search,
                                $options: "i"
                            }
                        },
                        {
                            phone: {
                                $regex: search,
                                $options: "i"
                            }
                        }

                    ]
                }
            }
        );
    }
    pipeline.push({
        $facet: {
            employees: [
                { $sort: sort },
                { $skip: skip },
                { $limit: limitNumber }
            ],
            totalemployees: [
                { $count: "count" }
            ]
        }
    });
    //console.log(filter);
    // const data = await Employee.find(filter)
    //     .populate("userId").sort(sort).skip(skip).limit(limitNumber);
    // const data = await Employee.aggregate([
    //     { $match: filter },
    //     { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
    //     { $unwind: '$user' },
    //     { $sort: sort },
    //     { $skip: skip },
    //     { $limit: limitNumber }
    // ])
    const data = await Employee.aggregate(pipeline);
    // console.log(data[0].employees);
    if (!data) {
        throw new AppError("Employee not found", 404);
    }
    // console.log("Data:", data);
    // const activeEmployees = data.filter(employee => employee.userId);
    //const totalemployees = await Employee.countDocuments(filter);
    const totalPages = Math.ceil((data[0].totalemployees[0]?.count || 0) / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;
    const response = {
        data: data[0].employees,
        totalPages,
        totalemployees: data[0].totalemployees[0]?.count || 0,
        currentPage: pageNumber,
        hasNextPage,
        hasPreviousPage
    }
    //  console.log("Response:", response);
    return response;
}

const createEmployee = async (data) => {
    // console.log(data);
    const { firstName, lastName, email, phone, department, designation, joiningDate, salary, password, role, profileImage, managerId } = data;
    //transaction for user and employee
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            throw new AppError("Employee already exists", 400, { email: "Employee alredy exists with email" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // const newUser = new User([
        //     {
        //         email: email,
        //         password: hashedPassword,
        //         role: role
        //     }
        // ], { session })
        // const savedUser = await newUser.save().session(session);
        const [savedUser] = await User.create(
            [{
                email: email,
                password: hashedPassword,
                role: role
            }], { session }
        );

        // const newEmployee = new Employee([{
        //     userId: savedUser._id,
        //     firstName,
        //     lastName,
        //     phone,
        //     department,
        //     joiningDate,
        //     salary,
        //     designation,
        //     profileImage
        // }], { session });
        // const savedEmployee = await newEmployee.save();
        const [savedEmployee] = await Employee.create([
            {
                userId: savedUser._id,
                firstName,
                lastName,
                phone,
                department,
                joiningDate,
                salary,
                designation,
                profileImage
            }
        ], { session });
        await session.commitTransaction();
        return savedEmployee;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const getEmployee = async (id) => {
    const data = await Employee.findById(id).populate("userId").populate("department").populate("designation");
    //console.log(data);
    if (!data) {
        throw new AppError("Employee not found", 404);
    }
    return data;
}

const updateEmployee = async (id, data) => {
    //console.log(" updateEmployee Data:", data);
    const employee = await Employee.findById(id).populate("userId").populate("department").populate("designation");
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    // console.log(employee);
    // const userupdate = await user.findById(data.userId);
    // if (!userupdate) {
    //     throw new AppError("User not found", 404);
    // }
    if (data.email !== employee.userId.email) {

        const existingUser = await User.findOne({
            email: data.email,
            _id: { $ne: employee.userId._id }
        });

        if (existingUser) {
            throw new AppError("Email already exists", 400);
        }
    }
    await User.findByIdAndUpdate(employee.userId, { email: data.email, role: data.role }, { new: true });
    // if (data.profileImage) {
    //     if (employee.profileImage) {
    //         const imagePath = path.join(__dirname, "../uploads/profile", employee.profileImage);
    //         fs.unlinkSync(imagePath);
    //     }
    //     // Add the new profile image
    //     employee.profileImage = data.profileImage;
    // }
    const employeeupdate = await Employee.findByIdAndUpdate(id, data, { new: true });
    if (!employeeupdate) {
        throw new AppError("Employee not found", 404, { email: "Employee not exists with email" });
    }
    return employeeupdate;
}
const deleteEmployee = async (id) => {
    const employee = await Employee.findById(id).populate("userId");
    if (!employee) {
        throw new AppError("Employee not found", 404, { email: "Employee not exists with email" });
    }
    const userupdate = await User.findByIdAndUpdate(employee.userId, { isActive: false }, { new: true });
    return userupdate;
}
module.exports = { getAll, createEmployee, getEmployee, updateEmployee, deleteEmployee }