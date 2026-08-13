const { get } = require("mongoose");
const employeeService = require("../services/employee.service");
const uploadTos3 = require("../utils/uploadTos3");
const deleteFromS3 = require("../utils/deleteForms3");
const generateSignedUrl = require("../utils/gets3SignedUrl");

const getallemployee = async (req, res) => {
    const data = await employeeService.getAll(req, res);
    //console.log(data);
    for (const employee of data.data) {

        if (employee.profileImage?.key) {
            employee.profileImage.url =
                await generateSignedUrl(employee.profileImage.key);
        }
    }

    res.status(201).json({
        success: true,
        message: "Employees fetched successfully",
        data: data

    })
}

const getEmployee = async (req, res) => {
    const id = req.params.id;
    const data = (await employeeService.getEmployee(id));
    if (data.profileImage.key) {
        data.profileImage.url = await generateSignedUrl(data.profileImage.key);
    }
    res.status(200).json({
        success: true,
        message: "Employee fetched successfully",
        data: data

    })
}

const createEmployee = async (req, res) => {
    // console.log("File:", req.file);
    //console.log("Data:", req.body);
    if (req.file) {
        // const image = await uploadTos3(req.file);
        // req.body.profileImage = {
        //     url: image.url,
        //     key: image.key
        // }
        //req.body.profileImage = req.file.filename;
        req.body.profileImage = await uploadTos3(req.file);

    }
    const data = await employeeService.createEmployee(req.body);
    res.status(201).json({
        success: true,
        message: "Employess created",
        data: {
            employee: data
        }
    })
}

const updateEmployee = async (req, res) => {
    const id = req.params.id;
    const employee = await employeeService.getEmployee(id);

    if (req.file) {
        //req.body.profileImage = req.file.filename;
        if (employee.profileImage?.key) {
            await deleteFromS3(employee.profileImage.key);
            console.log("key:", employee.profileImage.key)
        }
        req.body.profileImage = await uploadTos3(req.file);
    }
    const updatedEmployee = await employeeService.updateEmployee(id, req.body);
    if (updatedEmployee.profileImage?.key) {
        updatedEmployee.profileImage.url =
            await generateSignedUrl(updatedEmployee.profileImage.key);
    }
    res.status(201).json({
        success: true,
        message: "Employee updated successfully",
        data: {
            employee: updatedEmployee
        }
    })
}
const deleteEmployee = async (req, res) => {
    const id = req.params.id;
    const deletedEmployee = await employeeService.deleteEmployee(id);
    res.status(201).json({
        success: true,
        message: "Employee deleted successfully",
        data: {
            employee: deletedEmployee
        }
    })
}
module.exports = { getallemployee, createEmployee, getEmployee, updateEmployee, deleteEmployee }