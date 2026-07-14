const departmentService = require("../../services/hr/departmentService");

const getDepartments = async (req, res) => {

    try {

        const departments =
            await departmentService.getDepartments();

        res.json({

            success: true,

            data: departments

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const createDepartment = async (req, res) => {

    try {

        const department =
            await departmentService.createDepartment(req.body);

        res.status(201).json({

            success: true,

            data: department

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getDepartments,

    createDepartment

};