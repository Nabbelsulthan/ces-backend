const designationService =
    require("../../services/hr/designationService");

// GET
const getDesignations = async (req, res) => {

    try {

        const designations =
            await designationService.getDesignations();

        res.json({

            success: true,

            data: designations

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// POST
const createDesignation = async (req, res) => {

    try {

        const designation =
            await designationService.createDesignation(req.body);

        res.status(201).json({

            success: true,

            data: designation

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


const getDesignationsByDepartment = async (req, res) => {

    try {

        const data =
            await designationService.getDesignationsByDepartment(
                req.params.departmentId
            );

        res.json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {

    getDesignations,

    createDesignation,

    getDesignationsByDepartment

};