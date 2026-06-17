
const express = require("express");
const router = express.Router();
const multer = require("multer");

const pool = require("../config/db");

const fs = require("fs");

/* ---------------- MULTER ---------------- */

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        const folder =
            `uploads/project-${req.body.project_id}`;

        fs.mkdirSync(folder, {
            recursive: true,
        });

        cb(null, folder);
    },

    filename: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            Date.now() +
            "-" +
            file.originalname
        );

    },

});

const upload = multer({
    storage,
});

/* ---------------- UPLOAD DOCUMENT ---------------- */

router.post(
    "/",
    upload.single("document"),
    async (req, res) => {

        try {

            console.log("BODY:", req.body);
            console.log("FILE:", req.file);

            const { project_id } =
                req.body;

            if (!req.file) {
                return res.status(400).json({
                    message:
                        "No file uploaded",
                });
            }

            const result =
                await pool.query(
                    `
          INSERT INTO documents
          (
            project_id,
            file_name,
            file_path
          )
          VALUES
          ($1,$2,$3)
          RETURNING *
          `,
                    [
                        project_id,
                        req.file.originalname,
                        req.file.path,
                    ]
                );

            res.status(201).json(
                result.rows[0]
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    error.message,
            });

        }

    }
);

/* ---------------- GET DOCUMENTS BY PROJECT ---------------- */

router.get(
    "/:projectId",
    async (req, res) => {

        try {

            const {
                projectId,
            } = req.params;

            const result =
                await pool.query(
                    `
          SELECT *
          FROM documents
          WHERE project_id = $1
          ORDER BY uploaded_at DESC
          `,
                    [projectId]
                );

            res.json(
                result.rows
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    error.message,
            });

        }

    }
);

/* ---------------- DELETE DOCUMENT ---------------- */

// router.delete(
//     "/:id",
//     async (req, res) => {

//         try {

//             const { id } =
//                 req.params;

//             await pool.query(
//                 `
//         DELETE FROM documents
//         WHERE id = $1
//         `,
//                 [id]
//             );

//             res.json({
//                 message:
//                     "Document deleted",
//             });

//         } catch (error) {

//             console.error(error);

//             res.status(500).json({
//                 error:
//                     error.message,
//             });

//         }

//     }
// );

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      const documentResult =
        await pool.query(
          `
          SELECT *
          FROM documents
          WHERE id = $1
          `,
          [id]
        );

      const document =
        documentResult.rows[0];

      if (!document) {
        return res.status(404).json({
          message:
            "Document not found",
        });
      }

      if (
        fs.existsSync(
          document.file_path
        )
      ) {
        fs.unlinkSync(
          document.file_path
        );
      }

      await pool.query(
        `
        DELETE FROM documents
        WHERE id = $1
        `,
        [id]
      );

      res.json({
        message:
          "Document deleted",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });

    }

  }
);
module.exports = router;