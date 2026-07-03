const express = require("express");
const router = express.Router();
const multer = require("multer");


const pool = require("../config/db");

const {
    uploadFile,
    deleteFile,
} = require("../utils/storage");




const upload = multer({
    storage: multer.memoryStorage(),
});


router.post(
    "/",
    upload.single("report"),
    async (req, res) => {

        try {

            const {
                project_id,
            } = req.body;

            const safeFileName =
                req.file.originalname.replace(/[^\w.-]/g, "_");

            const filePath =
                `project-${project_id}/${Date.now()}-${safeFileName}`;

            await uploadFile(
                "fat-reports",
                filePath,
                req.file
            );

            try {

                const result =
                    await pool.query(
                        `
            INSERT INTO public.fat_reports
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
                            safeFileName,
                            filePath,
                        ]
                    );

                res.status(201).json(
                    result.rows[0]
                );

            } catch (err) {

                await deleteFile(
                    "fat-reports",
                    filePath
                );

                throw err;

            }

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
                    FROM public.fat_reports
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
                    FROM public.fat_reports
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
                DELETE FROM public.fat_reports
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