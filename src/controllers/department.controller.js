const departmentService = require('../services/departmenr.service');
const createDepartment = async (req, res) => {

    const department = await departmentService.createDepartment(req.body);

    res.status(201).json({
        success: true,
        message: "Department created successfully",
        data: {
            department
        }
    });

};
const getAllDepartments = async (req, res) => {

    const data = await departmentService.getAllDepartments(req);

    res.status(200).json({
        success: true,
        message: "Departments fetched successfully",
        data
    });

};

const getDepartmentById = async (req, res) => {
    const id = req.params.id;
    const department = await departmentService.getDepartmentById(id);
    res.status(200).json({
        success: true,
        message: "Department fetched successfully",
        data: department
    })
}

const updateDepartment = async (req, res) => {

    const department = await departmentService.updateDepartment(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Department updated successfully",
        data: {
            department
        }
    });

};

const deleteDepartment = async (req, res) => {

    const department = await departmentService.deleteDepartment(req.params.id);

    res.status(200).json({
        success: true,
        message: "Department deleted successfully",
        data: {
            department
        }
    });

};

const getDepartmentDropDown = async (req, res) => {
    const departments = await departmentService.getDepartmentDropDown();
    res.status(200).json({
        success: true,
        message: "Departments fetched successfully",
        data: departments
    })
}

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    getDepartmentDropDown
};