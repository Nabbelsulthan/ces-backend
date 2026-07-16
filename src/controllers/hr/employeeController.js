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


const getEmployeeById = async (req, res) => {

    try {

        const employee =
            await employeeService.getEmployeeById(req.params.id);

        res.json({
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

const updateEmployee = async (req, res) => {

    try {

        const employee =
            await employeeService.updateEmployee(
                req.params.id,
                req.body
            );

        res.json({
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

const deleteEmployee = async (req, res) => {

    try {

        await employeeService.deleteEmployee(req.params.id);

        res.json({

            success: true,

            message: "Employee deleted successfully"

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

    getEmployeeById,

    createEmployee,

    updateEmployee,

    deleteEmployee

};