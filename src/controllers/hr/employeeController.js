const employeeService =
require("../../services/hr/employeeService");

const getEmployees = async (req, res) => {

    try {

        const employees =
            await employeeService.getEmployees();

        res.json({
            success: true,
            data: employees
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const createEmployee = async (req, res) => {

    try {

        const employee =
            await employeeService.createEmployee(req.body);

        res.status(201).json({
            success: true,
            data: employee
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getEmployees,
    createEmployee
};