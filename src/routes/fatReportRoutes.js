const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const pool = require("../config/db");

const storage = multer.diskStorage({

    destination(req, file, cb) {

        const folder =
            `uploads/fat-reports/project-${req.body.project_id}`;

        fs.mkdirSync(folder, {
            recursive: true,
        });

        cb(null, folder);
    },

    filename(req, file, cb) {

        cb(
            null,
            Date.now() +
            "-" +
            file.originalname
        );

    },

});

const upload =
    multer({
        storage,
    });

router.post(
    "/",
    upload.single("report"),
    async (req, res) => {

        try {

            const {
                project_id,
            } = req.body;

            const result =
                await pool.query(
                    `
                    INSERT INTO fat_reports
                    (
                        project_id,
                        report_name,
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
                message:
                    "Server Error",
            });

        }

    }
);

router.get(
    "/:projectId",
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    SELECT *
                    FROM fat_reports
                    WHERE project_id = $1
                    ORDER BY uploaded_at DESC
                    `,
                    [req.params.projectId]
                );

            res.json(
                result.rows
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Server Error",
            });

        }

    }
);

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const report =
                await pool.query(
                    `
                    SELECT *
                    FROM fat_reports
                    WHERE id = $1
                    `,
                    [req.params.id]
                );

            if (
                report.rows.length > 0
            ) {

                fs.unlinkSync(
                    report.rows[0].file_path
                );

            }

            await pool.query(
                `
                DELETE FROM fat_reports
                WHERE id = $1
                `,
                [req.params.id]
            );

            res.json({
                message:
                    "FAT Report Deleted",
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Server Error",
            });

        }

    }
);

module.exports = router;