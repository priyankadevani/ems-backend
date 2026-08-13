const Designation = require('../models/designation');
const { findById } = require('../models/user');
const AppError = require('../utils/AppError');
const Employee = require('../models/employee');

const createDesignation = async (data) => {
    const { name, description } = data;
    const existingDesignation = await Designation.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (existingDesignation) {
        throw new AppError("Designation already exists", 400, {
            name: "Designation already exists"
        });
    }
    const designation = await Designation.create({ name, description });
    return designation;


};
const getAllDesignations = async (req) => {
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

    const designations = await Designation.find(filter).sort(sort).skip(skip).limit(limit);
    if (!designations) {
        throw new AppError("Designations not found", 404, {
            serverError: "Designations not found"
        });
    }
    const totalDesignations = await Designation.countDocuments(filter);
    return {
        data: designations,
        totalDesignations,
        totalPages: Math.ceil(totalDesignations / limit),
        currentPage: page,
        hasNextPage: page * limit < totalDesignations,
        hasPreviousPage: page > 1

    };
};

const getDesignationById = async (id) => {
    const designation = await Designation.findById({ _id: id, isActive: true });
    if (!designation) {
        throw new AppError("Designation not found", 404, {
            serverError: "Designation not found"
        })
    }
    return designation
}

const updateDesignation = async (id, data) => {
    const designation = await Designation.findById(id);
    if (!designation || !designation.isActive) {
        throw new AppError("Designation not found", 404, {
            serverError: "Designation not found"
        })
    }
    if (data.name) {
        const exisitngDesignation = await Designation.findOne({
            _id: { $ne: id },
            name: {
                $regex: `^${data.name}$`,
                $options: "i"
            }
        })
        if (exisitngDesignation) {
            throw new AppError("Designation already exists", 400, {
                name: "Designation already exists"
            });
        }
    }
    const updatedDesignation = await Designation.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );
    return updatedDesignation
}

const deleteDesignation = async (id) => {
    const designation = await Designation.findById(id);
    if (!designation || !designation.isActive) {
        throw new AppError("Designation not found", 404, {
            serverError: "Designation not found"
        })
    }
    const employeeExists = await Employee.exists({ designation: id })
    if (employeeExists) {
        throw new AppError("Cannot delete designation because employees are assigned to it.",
            400, {
            serverError: "Cannot delete designation because employees are assigned to it."
        })
    }
    designation.isActive = false;
    await designation.save();
    return designation
}

const getDesignationDropDown = async () => {
    const designations = await Designation.find({ isActive: true });
    return designations
}

module.exports = { createDesignation, getAllDesignations, getDesignationById, updateDesignation, deleteDesignation, getDesignationDropDown }