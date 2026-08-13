const employeeModel = require('../models/employee');
const departmentModel = require('../models/department');
const designationModel = require('../models/designation');
const roleModel = require('../models/role');

const getDashboard = async (req, res) => {
    try {
        // const totalEmployees = await employeeModel.countDocuments();
        // const totalDepartments = await departmentModel.countDocuments();
        // const totalDesignations = await designationModel.countDocuments();
        // const totalRoles = await roleModel.countDocuments();

        const [totalEmployees,
            totalDepartments,
            totalDesignations,
            totalRoles
        ] = await Promise.all([
            employeeModel.countDocuments(),
            departmentModel.countDocuments(),
            designationModel.countDocuments(),
            roleModel.countDocuments()
        ]);
        const departmentChart = await employeeModel.aggregate([
            {
                $lookup: {
                    from: "departments",
                    localField: "department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $unwind: "$department"
            },
            {
                $group: {
                    _id: "$department.name",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }

        ]);

        const monthlyData = await employeeModel.aggregate([
            {
                $group: {
                    _id: {
                        $month: "$joiningDate"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        const employeeJoinedPerMonth = months.map((month, index) => {
            const found = monthlyData.find(item => item._id === index + 1);

            return {
                _id: month,
                count: found ? found.count : 0
            };
        });

        const recentEmployees = await employeeModel.find()
            .populate("department", "name")
            .populate("designation", "name")
            .sort({ createdAt: -1 })
            .limit(5)
            .select("firstName lastName profileImage department designation joiningDate")

        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: {
                totalEmployees,
                totalDepartments,
                totalDesignations,
                totalRoles,
                departmentChart,
                employeeJoinedPerMonth,
                recentEmployees
            }
        });

    } catch (error) {
        console.log("Error in fetching dashboard data", error);
        next(error);
    }
};

module.exports = {
    getDashboard
};