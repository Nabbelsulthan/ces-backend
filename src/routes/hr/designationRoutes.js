const express = require("express");

const router = express.Router();

const designationController =
    require("../../controllers/hr/designationController");

router.get("/", designationController.getDesignations);

router.get(
    "/department/:departmentId",
    designationController.getDesignationsByDepartment
);

router.post("/", designationController.createDesignation);

module.exports = router;