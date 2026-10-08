// const express = require("express");
// const router = express.Router();
// const pool = require("../config/db");
// const authenticateAdmin = require("../middleware/authenticateAdmin");

// /*
// |--------------------------------------------------------------------------
// | CES PROCUREMENT ROUTES
// |--------------------------------------------------------------------------
// | This module is isolated from the existing CES routes.
// |
// | Tables used:
// |   procurement_vendors
// |   procurement_makes
// |   procurement_materials
// |   procurement_project_materials
// |
// | Existing tables touched:
// |   projects (read-only relationship)
// |--------------------------------------------------------------------------
// */

// router.use(authenticateAdmin);


// /* =========================================================
//    VENDORS
//    ========================================================= */


// /*
// |--------------------------------------------------------------------------
// | GET /api/procurement/vendors
// |--------------------------------------------------------------------------
// | Optional:
// |   ?search=addon
// |   ?includeInactive=true
// |--------------------------------------------------------------------------
// */

// router.get("/vendors", async (req, res) => {
//     try {
//         const { search = "", includeInactive = "false" } = req.query;

//         let query = `
//             SELECT
//                 id,
//                 vendor_name,
//                 status,
//                 created_at,
//                 updated_at
//             FROM procurement_vendors
//             WHERE 1 = 1
//         `;

//         const values = [];

//         if (includeInactive !== "true") {
//             query += ` AND status = 'active'`;
//         }

//         if (search.trim()) {
//             values.push(`%${search.trim()}%`);
//             query += ` AND vendor_name ILIKE $${values.length}`;
//         }

//         query += ` ORDER BY vendor_name ASC`;

//         const result = await pool.query(query, values);

//         res.json(result.rows);

//     } catch (error) {
//         console.error("Get vendors error:", error);

//         res.status(500).json({
//             message: "Failed to load vendors"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | POST /api/procurement/vendors
// |--------------------------------------------------------------------------
// */

// router.post("/vendors", async (req, res) => {
//     try {
//         const { vendor_name } = req.body;

//         if (!vendor_name || !vendor_name.trim()) {
//             return res.status(400).json({
//                 message: "Vendor name is required"
//             });
//         }

//         const name = vendor_name.trim();

//         const existing = await pool.query(
//             `
//             SELECT id
//             FROM procurement_vendors
//             WHERE LOWER(TRIM(vendor_name)) = LOWER(TRIM($1))
//             LIMIT 1
//             `,
//             [name]
//         );

//         if (existing.rows.length > 0) {
//             return res.status(409).json({
//                 message: "Vendor already exists"
//             });
//         }

//         const result = await pool.query(
//             `
//             INSERT INTO procurement_vendors
//                 (vendor_name)
//             VALUES
//                 ($1)
//             RETURNING *
//             `,
//             [name]
//         );

//         res.status(201).json(result.rows[0]);

//     } catch (error) {
//         console.error("Create vendor error:", error);

//         res.status(500).json({
//             message: "Failed to create vendor"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | PUT /api/procurement/vendors/:id
// |--------------------------------------------------------------------------
// */

// router.put("/vendors/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { vendor_name, status } = req.body;

//         if (!vendor_name || !vendor_name.trim()) {
//             return res.status(400).json({
//                 message: "Vendor name is required"
//             });
//         }

//         const result = await pool.query(
//             `
//             UPDATE procurement_vendors
//             SET
//                 vendor_name = $1,
//                 status = COALESCE($2, status)
//             WHERE id = $3
//             RETURNING *
//             `,
//             [
//                 vendor_name.trim(),
//                 status || null,
//                 id
//             ]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: "Vendor not found"
//             });
//         }

//         res.json(result.rows[0]);

//     } catch (error) {
//         console.error("Update vendor error:", error);

//         res.status(500).json({
//             message: "Failed to update vendor"
//         });
//     }
// });


// /* =========================================================
//    MAKES
//    ========================================================= */


// /*
// |--------------------------------------------------------------------------
// | GET /api/procurement/makes
// |--------------------------------------------------------------------------
// */

// router.get("/makes", async (req, res) => {
//     try {
//         const { search = "", includeInactive = "false" } = req.query;

//         let query = `
//             SELECT
//                 id,
//                 make_name,
//                 status,
//                 created_at,
//                 updated_at
//             FROM procurement_makes
//             WHERE 1 = 1
//         `;

//         const values = [];

//         if (includeInactive !== "true") {
//             query += ` AND status = 'active'`;
//         }

//         if (search.trim()) {
//             values.push(`%${search.trim()}%`);
//             query += ` AND make_name ILIKE $${values.length}`;
//         }

//         query += ` ORDER BY make_name ASC`;

//         const result = await pool.query(query, values);

//         res.json(result.rows);

//     } catch (error) {
//         console.error("Get makes error:", error);

//         res.status(500).json({
//             message: "Failed to load makes"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | POST /api/procurement/makes
// |--------------------------------------------------------------------------
// */

// router.post("/makes", async (req, res) => {
//     try {
//         const { make_name } = req.body;

//         if (!make_name || !make_name.trim()) {
//             return res.status(400).json({
//                 message: "Make name is required"
//             });
//         }

//         const name = make_name.trim();

//         const existing = await pool.query(
//             `
//             SELECT id
//             FROM procurement_makes
//             WHERE LOWER(TRIM(make_name)) = LOWER(TRIM($1))
//             LIMIT 1
//             `,
//             [name]
//         );

//         if (existing.rows.length > 0) {
//             return res.status(409).json({
//                 message: "Make already exists"
//             });
//         }

//         const result = await pool.query(
//             `
//             INSERT INTO procurement_makes
//                 (make_name)
//             VALUES
//                 ($1)
//             RETURNING *
//             `,
//             [name]
//         );

//         res.status(201).json(result.rows[0]);

//     } catch (error) {
//         console.error("Create make error:", error);

//         res.status(500).json({
//             message: "Failed to create make"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | PUT /api/procurement/makes/:id
// |--------------------------------------------------------------------------
// */

// router.put("/makes/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { make_name, status } = req.body;

//         if (!make_name || !make_name.trim()) {
//             return res.status(400).json({
//                 message: "Make name is required"
//             });
//         }

//         const result = await pool.query(
//             `
//             UPDATE procurement_makes
//             SET
//                 make_name = $1,
//                 status = COALESCE($2, status)
//             WHERE id = $3
//             RETURNING *
//             `,
//             [
//                 make_name.trim(),
//                 status || null,
//                 id
//             ]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: "Make not found"
//             });
//         }

//         res.json(result.rows[0]);

//     } catch (error) {
//         console.error("Update make error:", error);

//         res.status(500).json({
//             message: "Failed to update make"
//         });
//     }
// });


// /* =========================================================
//    MATERIALS
//    ========================================================= */


// /*
// |--------------------------------------------------------------------------
// | GET /api/procurement/materials
// |--------------------------------------------------------------------------
// */

// router.get("/materials", async (req, res) => {
//     try {
//         const { search = "", includeInactive = "false" } = req.query;

//         let query = `
//             SELECT
//                 id,
//                 material_name,
//                 status,
//                 created_at,
//                 updated_at
//             FROM procurement_materials
//             WHERE 1 = 1
//         `;

//         const values = [];

//         if (includeInactive !== "true") {
//             query += ` AND status = 'active'`;
//         }

//         if (search.trim()) {
//             values.push(`%${search.trim()}%`);
//             query += ` AND material_name ILIKE $${values.length}`;
//         }

//         query += ` ORDER BY material_name ASC`;

//         const result = await pool.query(query, values);

//         res.json(result.rows);

//     } catch (error) {
//         console.error("Get materials error:", error);

//         res.status(500).json({
//             message: "Failed to load materials"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | POST /api/procurement/materials
// |--------------------------------------------------------------------------
// */

// router.post("/materials", async (req, res) => {
//     try {
//         const { material_name } = req.body;

//         if (!material_name || !material_name.trim()) {
//             return res.status(400).json({
//                 message: "Material name is required"
//             });
//         }

//         const name = material_name.trim();

//         const existing = await pool.query(
//             `
//             SELECT id
//             FROM procurement_materials
//             WHERE LOWER(TRIM(material_name)) = LOWER(TRIM($1))
//             LIMIT 1
//             `,
//             [name]
//         );

//         if (existing.rows.length > 0) {
//             return res.status(409).json({
//                 message: "Material already exists"
//             });
//         }

//         const result = await pool.query(
//             `
//             INSERT INTO procurement_materials
//                 (material_name)
//             VALUES
//                 ($1)
//             RETURNING *
//             `,
//             [name]
//         );

//         res.status(201).json(result.rows[0]);

//     } catch (error) {
//         console.error("Create material error:", error);

//         res.status(500).json({
//             message: "Failed to create material"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | PUT /api/procurement/materials/:id
// |--------------------------------------------------------------------------
// */

// router.put("/materials/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { material_name, status } = req.body;

//         if (!material_name || !material_name.trim()) {
//             return res.status(400).json({
//                 message: "Material name is required"
//             });
//         }

//         const result = await pool.query(
//             `
//             UPDATE procurement_materials
//             SET
//                 material_name = $1,
//                 status = COALESCE($2, status)
//             WHERE id = $3
//             RETURNING *
//             `,
//             [
//                 material_name.trim(),
//                 status || null,
//                 id
//             ]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: "Material not found"
//             });
//         }

//         res.json(result.rows[0]);

//     } catch (error) {
//         console.error("Update material error:", error);

//         res.status(500).json({
//             message: "Failed to update material"
//         });
//     }
// });



// /* =========================================================
//   PROCUREMENT PROJECTS
//   ========================================================= */

// /*
// |--------------------------------------------------------------------------
// | GET /api/procurement/projects
// |--------------------------------------------------------------------------
// | Returns only procurement projects.
// |--------------------------------------------------------------------------
// */

// router.get("/projects", async (req, res) => {
//     try {
//         const result = await pool.query(
//             `
//             SELECT
//                 id,
//                 project_code,
//                 project_name,
//                 description,
//                 status,
//                 created_at,
//                 updated_at
//             FROM procurement_projects
//             ORDER BY id ASC
//             `
//         );

//         res.json(result.rows);

//     } catch (error) {
//         console.error("Get procurement projects error:", error);

//         res.status(500).json({
//             message: "Failed to load procurement projects"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | POST /api/procurement/projects
// |--------------------------------------------------------------------------
// | Creates a NEW procurement-only project.
// |
// | IMPORTANT:
// | This does NOT insert anything into the main "projects" table.
// |--------------------------------------------------------------------------
// */

// router.post("/projects", async (req, res) => {
//     try {
//         const {
//             project_name,
//             description = null
//         } = req.body;

//         if (
//             !project_name ||
//             typeof project_name !== "string" ||
//             !project_name.trim()
//         ) {
//             return res.status(400).json({
//                 message: "Project name is required"
//             });
//         }

//         const name = project_name.trim();

//         /*
//         |--------------------------------------------------------------------------
//         | Generate next procurement number
//         |
//         | PROC-001
//         | PROC-002
//         | PROC-003
//         | ...
//         |--------------------------------------------------------------------------
//         */

//         const nextNumberResult = await pool.query(
//             `
//             SELECT
//                 COALESCE(
//                     MAX(
//                         (SUBSTRING(project_code FROM '^PROC-([0-9]+)$'))::BIGINT
//                     ),
//                     0
//                 ) + 1 AS next_number
//             FROM procurement_projects
//             `
//         );

//         const nextNumber =
//             Number(nextNumberResult.rows[0].next_number);

//         const projectCode =
//             `PROC-${String(nextNumber).padStart(3, "0")}`;

//         /*
//         |--------------------------------------------------------------------------
//         | Insert ONLY into procurement_projects
//         |--------------------------------------------------------------------------
//         */

//         const result = await pool.query(
//             `
//             INSERT INTO procurement_projects
//             (
//                 project_code,
//                 project_name,
//                 description,
//                 status
//             )
//             VALUES
//             (
//                 $1,
//                 $2,
//                 $3,
//                 'active'
//             )
//             RETURNING
//                 id,
//                 project_code,
//                 project_name,
//                 description,
//                 status,
//                 created_at,
//                 updated_at
//             `,
//             [
//                 projectCode,
//                 name,
//                 description
//                     ? String(description).trim()
//                     : null
//             ]
//         );

//         res.status(201).json(result.rows[0]);

//     } catch (error) {
//         console.error("Create procurement project error:", error);

//         /*
//         |--------------------------------------------------------------------------
//         | Handle duplicate PROC code safely
//         |--------------------------------------------------------------------------
//         */

//         if (error.code === "23505") {
//             return res.status(409).json({
//                 message:
//                     "A procurement project with this code already exists. Please try again."
//             });
//         }

//         res.status(500).json({
//             message: "Failed to create procurement project"
//         });
//     }
// });

// /* =========================================================
//    PROJECT MATERIALS / BOM
//    ========================================================= */


// /*
// |--------------------------------------------------------------------------
// | GET PROJECT BOM
// |
// | GET /api/procurement/projects/:projectId/materials
// |--------------------------------------------------------------------------
// */

// router.get("/projects/:projectId/materials", async (req, res) => {
//     try {
//         const { projectId } = req.params;

//         const result = await pool.query(
//             `
//             SELECT
//                 pm.id,
//                 pm.project_id,

//                 pm.material_id,
//                 m.material_name,

//                 pm.make_id,
//                 mk.make_name,

//                 pm.vendor_id,
//                 v.vendor_name,

//                 pm.quantity,
//                 pm.unit,
//                 pm.remarks,

//                 pm.created_at,
//                 pm.updated_at

//             FROM procurement_project_materials pm

//             INNER JOIN procurement_materials m
//                 ON m.id = pm.material_id

//             LEFT JOIN procurement_makes mk
//                 ON mk.id = pm.make_id

//             LEFT JOIN procurement_vendors v
//                 ON v.id = pm.vendor_id

//             WHERE pm.project_id = $1

//             ORDER BY pm.id ASC
//             `,
//             [projectId]
//         );

//         res.json(result.rows);

//     } catch (error) {
//         console.error("Get project materials error:", error);

//         res.status(500).json({
//             message: "Failed to load project materials"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | ADD MATERIAL TO PROJECT
// |
// | POST /api/procurement/projects/:projectId/materials
// |--------------------------------------------------------------------------
// */

// router.post("/projects/:projectId/materials", async (req, res) => {
//     try {
//         const { projectId } = req.params;

//         const {
//             material_id,
//             make_id,
//             vendor_id,
//             quantity = 1,
//             unit = "Nos",
//             remarks = null
//         } = req.body;

//         if (!material_id) {
//             return res.status(400).json({
//                 message: "Material is required"
//             });
//         }

//         if (quantity < 0) {
//             return res.status(400).json({
//                 message: "Quantity cannot be negative"
//             });
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Verify project exists
//         |--------------------------------------------------------------------------
//         */

//         // const project = await pool.query(
//         //     `
//         //     SELECT id
//         //     FROM projects
//         //     WHERE id = $1
//         //     LIMIT 1
//         //     `,
//         //     [projectId]
//         // );

//         const project = await pool.query(
//             `
//     SELECT
//         id,
//         project_code,
//         project_name
//     FROM procurement_projects
//     WHERE id = $1
//       AND status = 'active'
//     LIMIT 1
//     `,
//             [projectId]
//         );

//         if (project.rows.length === 0) {
//             return res.status(404).json({
//                 message: "Procurement project not found"
//             });
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Verify material exists
//         |--------------------------------------------------------------------------
//         */

//         const material = await pool.query(
//             `
//             SELECT id
//             FROM procurement_materials
//             WHERE id = $1
//               AND status = 'active'
//             LIMIT 1
//             `,
//             [material_id]
//         );

//         if (material.rows.length === 0) {
//             return res.status(400).json({
//                 message: "Invalid or inactive material"
//             });
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Verify make if provided
//         |--------------------------------------------------------------------------
//         */

//         if (make_id) {
//             const make = await pool.query(
//                 `
//                 SELECT id
//                 FROM procurement_makes
//                 WHERE id = $1
//                   AND status = 'active'
//                 LIMIT 1
//                 `,
//                 [make_id]
//             );

//             if (make.rows.length === 0) {
//                 return res.status(400).json({
//                     message: "Invalid or inactive make"
//                 });
//             }
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Verify vendor if provided
//         |--------------------------------------------------------------------------
//         */

//         if (vendor_id) {
//             const vendor = await pool.query(
//                 `
//                 SELECT id
//                 FROM procurement_vendors
//                 WHERE id = $1
//                   AND status = 'active'
//                 LIMIT 1
//                 `,
//                 [vendor_id]
//             );

//             if (vendor.rows.length === 0) {
//                 return res.status(400).json({
//                     message: "Invalid or inactive vendor"
//                 });
//             }
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Insert
//         |--------------------------------------------------------------------------
//         */

//         const result = await pool.query(
//             `
//             INSERT INTO procurement_project_materials
//             (
//                 project_id,
//                 material_id,
//                 make_id,
//                 vendor_id,
//                 quantity,
//                 unit,
//                 remarks
//             )
//             VALUES
//             (
//                 $1,
//                 $2,
//                 $3,
//                 $4,
//                 $5,
//                 $6,
//                 $7
//             )
//             RETURNING *
//             `,
//             [
//                 projectId,
//                 material_id,
//                 make_id || null,
//                 vendor_id || null,
//                 quantity,
//                 unit || "Nos",
//                 remarks || null
//             ]
//         );

//         res.status(201).json(result.rows[0]);

//     } catch (error) {
//         console.error("Add project material error:", error);

//         res.status(500).json({
//             message: "Failed to add project material"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | UPDATE PROJECT MATERIAL
// |
// | PUT /api/procurement/project-materials/:id
// |--------------------------------------------------------------------------
// */

// router.put("/project-materials/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         const {
//             material_id,
//             make_id,
//             vendor_id,
//             quantity,
//             unit,
//             remarks
//         } = req.body;

//         if (!material_id) {
//             return res.status(400).json({
//                 message: "Material is required"
//             });
//         }

//         if (quantity !== undefined && quantity < 0) {
//             return res.status(400).json({
//                 message: "Quantity cannot be negative"
//             });
//         }

//         const result = await pool.query(
//             `
//             UPDATE procurement_project_materials
//             SET
//                 material_id = $1,
//                 make_id = $2,
//                 vendor_id = $3,
//                 quantity = $4,
//                 unit = $5,
//                 remarks = $6
//             WHERE id = $7
//             RETURNING *
//             `,
//             [
//                 material_id,
//                 make_id || null,
//                 vendor_id || null,
//                 quantity ?? 1,
//                 unit || "Nos",
//                 remarks || null,
//                 id
//             ]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: "Project material not found"
//             });
//         }

//         res.json(result.rows[0]);

//     } catch (error) {
//         console.error("Update project material error:", error);

//         res.status(500).json({
//             message: "Failed to update project material"
//         });
//     }
// });


// /*
// |--------------------------------------------------------------------------
// | DELETE PROJECT MATERIAL
// |
// | DELETE /api/procurement/project-materials/:id
// |--------------------------------------------------------------------------
// */

// router.delete("/project-materials/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         const result = await pool.query(
//             `
//             DELETE FROM procurement_project_materials
//             WHERE id = $1
//             RETURNING id
//             `,
//             [id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: "Project material not found"
//             });
//         }

//         res.json({
//             message: "Project material deleted successfully",
//             id: result.rows[0].id
//         });

//     } catch (error) {
//         console.error("Delete project material error:", error);

//         res.status(500).json({
//             message: "Failed to delete project material"
//         });
//     }
// });


// module.exports = router;


const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateAdmin = require("../middleware/authenticateAdmin");

router.use(authenticateAdmin);

// =========================================================
// VENDORS
// =========================================================

router.get("/vendors", async (req, res) => {
    try {
        const { search = "", includeInactive = "false" } = req.query;

        let query = `
      SELECT
        id,
        vendor_name,
        status,
        created_at,
        updated_at
      FROM procurement_vendors
      WHERE 1 = 1
    `;

        const values = [];

        if (includeInactive !== "true") {
            query += ` AND status = 'active'`;
        }

        if (search.trim()) {
            values.push(`%${search.trim()}%`);
            query += ` AND vendor_name ILIKE $${values.length}`;
        }

        query += ` ORDER BY vendor_name ASC`;

        const result = await pool.query(query, values);

        res.json(result.rows);
    } catch (error) {
        console.error("Get vendors error:", error);

        res.status(500).json({
            message: "Failed to load vendors",
        });
    }
});

router.post("/vendors", async (req, res) => {
    try {
        const { vendor_name } = req.body;

        if (!vendor_name || !vendor_name.trim()) {
            return res.status(400).json({
                message: "Vendor name is required",
            });
        }

        const name = vendor_name.trim();

        const existing = await pool.query(
            `
      SELECT id
      FROM procurement_vendors
      WHERE LOWER(TRIM(vendor_name)) = LOWER(TRIM($1))
      LIMIT 1
      `,
            [name]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                message: "Vendor already exists",
            });
        }

        const result = await pool.query(
            `
      INSERT INTO procurement_vendors
        (vendor_name)
      VALUES
        ($1)
      RETURNING *
      `,
            [name]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Create vendor error:", error);

        res.status(500).json({
            message: "Failed to create vendor",
        });
    }
});

router.put("/vendors/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { vendor_name, status } = req.body;

        if (!vendor_name || !vendor_name.trim()) {
            return res.status(400).json({
                message: "Vendor name is required",
            });
        }

        const result = await pool.query(
            `
      UPDATE procurement_vendors
      SET
        vendor_name = $1,
        status = COALESCE($2, status)
      WHERE id = $3
      RETURNING *
      `,
            [
                vendor_name.trim(),
                status || null,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Vendor not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Update vendor error:", error);

        res.status(500).json({
            message: "Failed to update vendor",
        });
    }
});

// =========================================================
// MAKES
// =========================================================

router.get("/makes", async (req, res) => {
    try {
        const { search = "", includeInactive = "false" } = req.query;

        let query = `
      SELECT
        id,
        make_name,
        status,
        created_at,
        updated_at
      FROM procurement_makes
      WHERE 1 = 1
    `;

        const values = [];

        if (includeInactive !== "true") {
            query += ` AND status = 'active'`;
        }

        if (search.trim()) {
            values.push(`%${search.trim()}%`);
            query += ` AND make_name ILIKE $${values.length}`;
        }

        query += ` ORDER BY make_name ASC`;

        const result = await pool.query(query, values);

        res.json(result.rows);
    } catch (error) {
        console.error("Get makes error:", error);

        res.status(500).json({
            message: "Failed to load makes",
        });
    }
});

router.post("/makes", async (req, res) => {
    try {
        const { make_name } = req.body;

        if (!make_name || !make_name.trim()) {
            return res.status(400).json({
                message: "Make name is required",
            });
        }

        const name = make_name.trim();

        const existing = await pool.query(
            `
      SELECT id
      FROM procurement_makes
      WHERE LOWER(TRIM(make_name)) = LOWER(TRIM($1))
      LIMIT 1
      `,
            [name]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                message: "Make already exists",
            });
        }

        const result = await pool.query(
            `
      INSERT INTO procurement_makes
        (make_name)
      VALUES
        ($1)
      RETURNING *
      `,
            [name]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Create make error:", error);

        res.status(500).json({
            message: "Failed to create make",
        });
    }
});

router.put("/makes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { make_name, status } = req.body;

        if (!make_name || !make_name.trim()) {
            return res.status(400).json({
                message: "Make name is required",
            });
        }

        const result = await pool.query(
            `
      UPDATE procurement_makes
      SET
        make_name = $1,
        status = COALESCE($2, status)
      WHERE id = $3
      RETURNING *
      `,
            [
                make_name.trim(),
                status || null,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Make not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Update make error:", error);

        res.status(500).json({
            message: "Failed to update make",
        });
    }
});

// =========================================================
// MATERIALS
// =========================================================

router.get("/materials", async (req, res) => {
    try {
        const {
            search = "",
            includeInactive = "false",
        } = req.query;

        let query = `
      SELECT
        id,
        material_name,
        current_cost,
        status,
        created_at,
        updated_at
      FROM procurement_materials
      WHERE 1 = 1
    `;

        const values = [];

        if (includeInactive !== "true") {
            query += ` AND status = 'active'`;
        }

        if (search.trim()) {
            values.push(`%${search.trim()}%`);
            query += ` AND material_name ILIKE $${values.length}`;
        }

        query += ` ORDER BY material_name ASC`;

        const result = await pool.query(query, values);

        res.json(result.rows);
    } catch (error) {
        console.error("Get materials error:", error);

        res.status(500).json({
            message: "Failed to load materials",
        });
    }
});

router.post("/materials", async (req, res) => {
    try {
        const {
            material_name,
            current_cost = 0,
        } = req.body;

        if (!material_name || !material_name.trim()) {
            return res.status(400).json({
                message: "Material name is required",
            });
        }

        const name = material_name.trim();
        const cost = Number(current_cost);

        if (!Number.isFinite(cost) || cost < 0) {
            return res.status(400).json({
                message: "Material cost must be a valid non-negative number",
            });
        }

        const existing = await pool.query(
            `
      SELECT id
      FROM procurement_materials
      WHERE LOWER(TRIM(material_name)) = LOWER(TRIM($1))
      LIMIT 1
      `,
            [name]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                message: "Material already exists",
            });
        }

        const result = await pool.query(
            `
      INSERT INTO procurement_materials
        (
          material_name,
          current_cost
        )
      VALUES
        (
          $1,
          $2
        )
      RETURNING *
      `,
            [
                name,
                cost,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Create material error:", error);

        res.status(500).json({
            message: "Failed to create material",
        });
    }
});

router.put("/materials/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            material_name,
            current_cost = 0,
            status,
        } = req.body;

        if (!material_name || !material_name.trim()) {
            return res.status(400).json({
                message: "Material name is required",
            });
        }

        const cost = Number(current_cost);

        if (!Number.isFinite(cost) || cost < 0) {
            return res.status(400).json({
                message: "Material cost must be a valid non-negative number",
            });
        }

        const result = await pool.query(
            `
      UPDATE procurement_materials
      SET
        material_name = $1,
        current_cost = $2,
        status = COALESCE($3, status),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
            [
                material_name.trim(),
                cost,
                status || null,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Material not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Update material error:", error);

        res.status(500).json({
            message: "Failed to update material",
        });
    }
});




// =========================================================
// PROCUREMENT PROJECTS
// =========================================================

router.get("/projects", async (req, res) => {
    try {
        const result = await pool.query(
            `
      SELECT
        id,
        project_code,
        project_name,
        description,
        status,
        created_at,
        updated_at
      FROM procurement_projects
      ORDER BY created_at DESC, id DESC
      `
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Get procurement projects error:", error);

        res.status(500).json({
            message: "Failed to load procurement projects",
        });
    }
});

router.post("/projects", async (req, res) => {
    try {
        const {
            project_name,
            description = null,
            status = "active",
        } = req.body;

        if (!project_name || !project_name.trim()) {
            return res.status(400).json({
                message: "Project name is required",
            });
        }

        const name = project_name.trim();

        const existing = await pool.query(
            `
      SELECT id
      FROM procurement_projects
      WHERE LOWER(TRIM(project_name)) = LOWER(TRIM($1))
      LIMIT 1
      `,
            [name]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                message: "Procurement project already exists",
            });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            /*
             * Generate the next PROC-XXX project code.
             *
             * This is intentionally based only on procurement_projects.
             * The existing CES projects table is never modified.
             */
            const codeResult = await client.query(
                `
        SELECT
          COALESCE(
            MAX(
              CASE
                WHEN project_code ~ '^PROC-[0-9]+$'
                THEN CAST(SUBSTRING(project_code FROM 6) AS INTEGER)
                ELSE 0
              END
            ),
            0
          ) + 1 AS next_number
        FROM procurement_projects
        `
            );

            const nextNumber = Number(codeResult.rows[0].next_number);

            const projectCode = `PROC-${String(nextNumber).padStart(3, "0")}`;

            const projectResult = await client.query(
                `
        INSERT INTO procurement_projects
          (
            project_code,
            project_name,
            description,
            status
          )
        VALUES
          (
            $1,
            $2,
            $3,
            $4
          )
        RETURNING
          id,
          project_code,
          project_name,
          description,
          status,
          created_at,
          updated_at
        `,
                [
                    projectCode,
                    name,
                    description ? description.trim() : null,
                    status || "active",
                ]
            );

            await client.query("COMMIT");

            res.status(201).json(projectResult.rows[0]);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Create procurement project error:", error);

        res.status(500).json({
            message: "Failed to create procurement project",
        });
    }
});

// =========================================================
// PROCUREMENT PROJECT BOM
// =========================================================

router.get("/projects/:projectId/materials", async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await pool.query(
            `
      SELECT
        id,
        project_code,
        project_name,
        status
      FROM procurement_projects
      WHERE id = $1
      LIMIT 1
      `,
            [projectId]
        );

        if (project.rows.length === 0) {
            return res.status(404).json({
                message: "Procurement project not found",
            });
        }

        const result = await pool.query(
            `
      SELECT
        pm.id,
        pm.project_id,
        pm.material_id,

        m.material_name,

        pm.make_id,
        mk.make_name,

        pm.vendor_id,
        v.vendor_name,

        pm.quantity,
        pm.unit,

        pm.unit_cost,

        pm.remarks,

        pm.created_at,
        pm.updated_at

      FROM procurement_project_materials pm

      INNER JOIN procurement_materials m
        ON m.id = pm.material_id

      LEFT JOIN procurement_makes mk
        ON mk.id = pm.make_id

      LEFT JOIN procurement_vendors v
        ON v.id = pm.vendor_id

      WHERE pm.project_id = $1

      ORDER BY pm.id ASC
      `,
            [projectId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Get procurement BOM error:", error);

        res.status(500).json({
            message: "Failed to load project materials",
        });
    }
});

// =========================================================
// ADD MATERIAL TO PROCUREMENT PROJECT BOM
// =========================================================

router.post("/projects/:projectId/materials", async (req, res) => {
    try {
        const { projectId } = req.params;

        const {
            material_id,
            make_id = null,
            vendor_id = null,
            quantity = 1,
            unit = "Nos",
            unit_cost = null,
            remarks = null,
        } = req.body;

        // -----------------------------------------------------
        // Validate project
        // -----------------------------------------------------

        const projectResult = await pool.query(
            `
      SELECT
        id,
        status
      FROM procurement_projects
      WHERE id = $1
      LIMIT 1
      `,
            [projectId]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({
                message: "Procurement project not found",
            });
        }

        if (projectResult.rows[0].status !== "active") {
            return res.status(400).json({
                message: "Cannot add materials to an inactive project",
            });
        }

        // -----------------------------------------------------
        // Validate material
        // -----------------------------------------------------

        if (!material_id) {
            return res.status(400).json({
                message: "Material is required",
            });
        }

        const materialResult = await pool.query(
            `
      SELECT
        id,
        material_name,
        current_cost,
        status
      FROM procurement_materials
      WHERE id = $1
      LIMIT 1
      `,
            [material_id]
        );

        if (materialResult.rows.length === 0) {
            return res.status(404).json({
                message: "Material not found",
            });
        }

        const material = materialResult.rows[0];

        if (material.status !== "active") {
            return res.status(400).json({
                message: "Selected material is inactive",
            });
        }

        // -----------------------------------------------------
        // Validate make
        // -----------------------------------------------------

        if (make_id) {
            const makeResult = await pool.query(
                `
        SELECT
          id,
          status
        FROM procurement_makes
        WHERE id = $1
        LIMIT 1
        `,
                [make_id]
            );

            if (makeResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Make not found",
                });
            }

            if (makeResult.rows[0].status !== "active") {
                return res.status(400).json({
                    message: "Selected make is inactive",
                });
            }
        }

        // -----------------------------------------------------
        // Validate vendor
        // -----------------------------------------------------

        if (vendor_id) {
            const vendorResult = await pool.query(
                `
        SELECT
          id,
          status
        FROM procurement_vendors
        WHERE id = $1
        LIMIT 1
        `,
                [vendor_id]
            );

            if (vendorResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Vendor not found",
                });
            }

            if (vendorResult.rows[0].status !== "active") {
                return res.status(400).json({
                    message: "Selected vendor is inactive",
                });
            }
        }

        // -----------------------------------------------------
        // Validate quantity
        // -----------------------------------------------------

        const parsedQuantity = Number(quantity);

        if (
            !Number.isFinite(parsedQuantity) ||
            parsedQuantity <= 0
        ) {
            return res.status(400).json({
                message: "Quantity must be greater than zero",
            });
        }

        // -----------------------------------------------------
        // Determine unit cost
        //
        // If frontend sends a cost, use that.
        // Otherwise snapshot the current master material cost.
        // -----------------------------------------------------

        let snapshotCost;

        if (
            unit_cost !== null &&
            unit_cost !== undefined &&
            unit_cost !== ""
        ) {
            snapshotCost = Number(unit_cost);
        } else {
            snapshotCost = Number(material.current_cost || 0);
        }

        if (
            !Number.isFinite(snapshotCost) ||
            snapshotCost < 0
        ) {
            return res.status(400).json({
                message: "Unit cost must be a valid non-negative number",
            });
        }

        // -----------------------------------------------------
        // Insert BOM item
        // -----------------------------------------------------

        const result = await pool.query(
            `
      INSERT INTO procurement_project_materials
        (
          project_id,
          material_id,
          make_id,
          vendor_id,
          quantity,
          unit,
          unit_cost,
          remarks
        )
      VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8
        )
      RETURNING *
      `,
            [
                projectId,
                material_id,
                make_id || null,
                vendor_id || null,
                parsedQuantity,
                unit?.trim() || "Nos",
                snapshotCost,
                remarks?.trim() || null,
            ]
        );

        // -----------------------------------------------------
        // Return the complete BOM row
        // -----------------------------------------------------

        const bomResult = await pool.query(
            `
      SELECT
        pm.id,
        pm.project_id,
        pm.material_id,

        m.material_name,

        pm.make_id,
        mk.make_name,

        pm.vendor_id,
        v.vendor_name,

        pm.quantity,
        pm.unit,

        pm.unit_cost,

        pm.remarks,

        pm.created_at,
        pm.updated_at

      FROM procurement_project_materials pm

      INNER JOIN procurement_materials m
        ON m.id = pm.material_id

      LEFT JOIN procurement_makes mk
        ON mk.id = pm.make_id

      LEFT JOIN procurement_vendors v
        ON v.id = pm.vendor_id

      WHERE pm.id = $1
      LIMIT 1
      `,
            [result.rows[0].id]
        );

        res.status(201).json(bomResult.rows[0]);
    } catch (error) {
        console.error("Add procurement BOM item error:", error);

        res.status(500).json({
            message: "Failed to add material to project",
        });
    }
});




// =========================================================
// UPDATE PROCUREMENT PROJECT BOM ITEM
// =========================================================

router.put("/project-materials/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      material_id,
      make_id = null,
      vendor_id = null,
      quantity = 1,
      unit = "Nos",
      unit_cost = null,
      remarks = null,
    } = req.body;

    // -----------------------------------------------------
    // Validate material
    // -----------------------------------------------------

    if (!material_id) {
      return res.status(400).json({
        message: "Material is required",
      });
    }

    const materialResult = await pool.query(
      `
      SELECT
        id,
        material_name,
        current_cost,
        status
      FROM procurement_materials
      WHERE id = $1
      LIMIT 1
      `,
      [material_id]
    );

    if (materialResult.rows.length === 0) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    if (materialResult.rows[0].status !== "active") {
      return res.status(400).json({
        message: "Selected material is inactive",
      });
    }

    // -----------------------------------------------------
    // Validate quantity
    // -----------------------------------------------------

    const parsedQuantity = Number(quantity);

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be greater than zero",
      });
    }

    // -----------------------------------------------------
    // Validate make
    // -----------------------------------------------------

    if (make_id) {
      const makeResult = await pool.query(
        `
        SELECT
          id,
          status
        FROM procurement_makes
        WHERE id = $1
        LIMIT 1
        `,
        [make_id]
      );

      if (makeResult.rows.length === 0) {
        return res.status(404).json({
          message: "Make not found",
        });
      }

      if (makeResult.rows[0].status !== "active") {
        return res.status(400).json({
          message: "Selected make is inactive",
        });
      }
    }

    // -----------------------------------------------------
    // Validate vendor
    // -----------------------------------------------------

    if (vendor_id) {
      const vendorResult = await pool.query(
        `
        SELECT
          id,
          status
        FROM procurement_vendors
        WHERE id = $1
        LIMIT 1
        `,
        [vendor_id]
      );

      if (vendorResult.rows.length === 0) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }

      if (vendorResult.rows[0].status !== "active") {
        return res.status(400).json({
          message: "Selected vendor is inactive",
        });
      }
    }

    // -----------------------------------------------------
    // Unit cost
    //
    // If frontend sends a new cost, update it.
    //
    // If unit_cost is omitted/null, preserve the existing
    // project BOM cost instead of replacing it with the
    // current master material cost.
    // -----------------------------------------------------

    let parsedUnitCost = null;

    if (
      unit_cost !== null &&
      unit_cost !== undefined &&
      unit_cost !== ""
    ) {
      parsedUnitCost = Number(unit_cost);

      if (
        !Number.isFinite(parsedUnitCost) ||
        parsedUnitCost < 0
      ) {
        return res.status(400).json({
          message: "Unit cost must be a valid non-negative number",
        });
      }
    }

    // -----------------------------------------------------
    // Update BOM item
    // -----------------------------------------------------

    const result = await pool.query(
      `
      UPDATE procurement_project_materials
      SET
        material_id = $1,
        make_id = $2,
        vendor_id = $3,
        quantity = $4,
        unit = $5,

        unit_cost =
          COALESCE($6, unit_cost),

        remarks = $7,
        updated_at = NOW()

      WHERE id = $8

      RETURNING *
      `,
      [
        material_id,
        make_id || null,
        vendor_id || null,
        parsedQuantity,
        unit?.trim() || "Nos",
        parsedUnitCost,
        remarks?.trim() || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project material not found",
      });
    }

    // -----------------------------------------------------
    // Return complete updated BOM row
    // -----------------------------------------------------

    const updatedResult = await pool.query(
      `
      SELECT
        pm.id,
        pm.project_id,
        pm.material_id,

        m.material_name,

        pm.make_id,
        mk.make_name,

        pm.vendor_id,
        v.vendor_name,

        pm.quantity,
        pm.unit,

        pm.unit_cost,

        pm.remarks,

        pm.created_at,
        pm.updated_at

      FROM procurement_project_materials pm

      INNER JOIN procurement_materials m
        ON m.id = pm.material_id

      LEFT JOIN procurement_makes mk
        ON mk.id = pm.make_id

      LEFT JOIN procurement_vendors v
        ON v.id = pm.vendor_id

      WHERE pm.id = $1

      LIMIT 1
      `,
      [id]
    );

    res.json(updatedResult.rows[0]);
  } catch (error) {
    console.error("Update procurement BOM item error:", error);

    res.status(500).json({
      message: "Failed to update project material",
    });
  }
});

// =========================================================
// DELETE PROCUREMENT PROJECT BOM ITEM
// =========================================================

router.delete("/project-materials/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM procurement_project_materials
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project material not found",
      });
    }

    res.json({
      message: "Project material deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete procurement BOM item error:", error);

    res.status(500).json({
      message: "Failed to delete project material",
    });
  }
});

// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;