const department = require('../models/department');
const Department = require('../models/department');
const { findById } = require('../models/user');
const AppError = require('../utils/AppError');
const Employee = require('../models/employee');

const createDepartment = async (data) => {
    const { name, description } = data;
    const existingDepartment = await Department.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (existingDepartment) {
        throw new AppError("Department already exists", 400, {
            name: "Department already exists"
        });
    }
    const department = await Department.create({ name, description });
    return department;


};
const getAllDepartments = async (req) => {
    const search = req.query.search;
    let sort = req.query.sort || "-createdAt";
    if (sort.startsWith('-')) {
        sort = { [sort.slice(1)]: -1 };
    } else {
        sort = { [sort]: 1 }
    }

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);
    const skip = (page - 1) * limit;

    const filter = {
        isActive: true
    }

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i"
        }
    }

    const departments = await Department.find(filter).sort(sort).skip(skip).limit(limit);
    if (!departments) {
        throw new AppError("Departments not found", 404, {
            serverError: "Departments not found"
        });
    }
    const totalDepartments = await Department.countDocuments(filter);
    return {
        data: departments,
        totalDepartments,
        totalPages: Math.ceil(totalDepartments / limit),
        currentPage: page,
        hasNextPage: page * limit < totalDepartments,
        hasPreviousPage: page > 1

    };
};

const getDepartmentById = async (id) => {
    const department = await Department.findById({ _id: id, isActive: true });
    if (!department) {
        throw new AppError("Department not found", 404, {
            serverError: "Departmen not found"
        })
    }
    return department
}

const updateDepartment = async (id, data) => {
    const department = await Department.findById(id);
    if (!department || !department.isActive) {
        throw new AppError("Department not found", 404, {
            serverError: "Departmen not found"
        })
    }
    if (data.name) {
        const exisitngDepartment = await Department.findOne({
            _id: { $ne: id },
            name: {
                $regex: `^${data.name}$`,
                $options: "i"
            }
        })
        if (exisitngDepartment) {
            throw new AppError("Department already exists", 400, {
                name: "Department already exists"
            });
        }
    }
    const updatedDepartment = await Department.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );
    return updatedDepartment
}

const deleteDepartment = async (id) => {
    const department = await Department.findById(id);
    if (!department || !department.isActive) {
        throw new AppError("Department not found", 404, {
            serverError: "Department not found"
        })
    }
    const employeeExists = await Employee.exists({ department: id })
    if (employeeExists) {
        throw new AppError("Cannot delete department because employees are assigned to it.",
            400, {
            serverError: "Cannot delete department because employees are assigned to it."
        })
    }
    department.isActive = false;
    await department.save();
    return department
}

const getDepartmentDropDown = async () => {
    const departments = await Department.find({ isActive: true });
    return departments
}

module.exports = { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment, getDepartmentDropDown }