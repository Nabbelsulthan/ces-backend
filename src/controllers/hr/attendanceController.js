const attendanceService =
require("../../services/hr/attendanceService");

const getAttendance = async (req, res) => {

    try {

        const data =
            await attendanceService.getAttendance();

        res.json({

            success: true,

            data

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const createAttendance = async (req, res) => {

    try {

        const data =
            await attendanceService.createAttendance(req.body);

        res.status(201).json({

            success: true,

            data

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {

    getAttendance,

    createAttendance

};