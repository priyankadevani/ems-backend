const designationService = require('../services/designation.service');
const createDesignation = async (req, res) => {

    const designation = await designationService.createDesignation(req.body);

    res.status(201).json({
        success: true,
        message: "Designation created successfully",
        data: {
            designation
        }
    });

};
const getAllDesignations = async (req, res) => {

    const data = await designationService.getAllDesignations(req);

    res.status(200).json({
        success: true,
        message: "Designations fetched successfully",
        data
    });

};

const getDesignationById = async (req, res) => {
    const id = req.params.id;
    const designation = await designationService.getDesignationById(id);
    res.status(200).json({
        success: true,
        message: "Designation fetched successfully",
        data: designation
    })
}

const updateDesignation = async (req, res) => {

    const designation = await designationService.updateDesignation(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Designation updated successfully",
        data: {
            designation
        }
    });

};

const deleteDesignation = async (req, res) => {

    const designation = await designationService.deleteDesignation(req.params.id);

    res.status(200).json({
        success: true,
        message: "Designation deleted successfully",
        data: {
            designation
        }
    });

};

const getDesignationDropDown = async (req, res) => {
    const designations = await designationService.getDesignationDropDown();
    res.status(200).json({
        success: true,
        message: "Designations fetched successfully",
        data: designations
    })
}

module.exports = {
    createDesignation,
    getAllDesignations,
    getDesignationById,
    updateDesignation,
    deleteDesignation,
    getDesignationDropDown
};