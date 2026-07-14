const express = require("express");

const router = express.Router();

const departmentController =
require("../../controllers/hr/departmentController");

router.get(
    "/",
    departmentController.getDepartments
);

router.post(
    "/",
    departmentController.createDepartment
);

module.exports = router;