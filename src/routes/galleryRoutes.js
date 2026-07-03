const express =
    require("express");

const router =
    express.Router();

const multer =
    require("multer");



const pool =
    require("../config/db");

const {
    uploadFile,
    deleteFile,
} = require("../utils/storage");




const upload = multer({
    storage: multer.memoryStorage(),
});

router.post(
    "/",
    upload.single("image"),
    async (req, res) => {

        try {

            const {
                project_id,
                caption,
            } = req.body;

            const safeFileName =
                req.file.originalname.replace(/[^\w.-]/g, "_");

            const imagePath =
                `project-${project_id}/${Date.now()}-${safeFileName}`;

            await uploadFile(
                "gallery",
                imagePath,
                req.file
            );

            try {

                const result =
                    await pool.query(
                        `
            INSERT INTO public.project_gallery
            (
                project_id,
                image_name,
                image_path,
                caption
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *
            `,
                        [
                            project_id,
                            safeFileName,
                            imagePath,
                            caption,
                        ]
                    );

                res.json(result.rows[0]);

            } catch (err) {

                await deleteFile(
                    "gallery",
                    imagePath
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
          FROM public.project_gallery
          WHERE project_id = $1
          ORDER BY uploaded_at DESC
          `,
                    [
                        req.params.projectId,
                    ]
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

            const image =
                await pool.query(
                    `
          SELECT *
          FROM public.project_gallery
          WHERE id = $1
          `,
                    [req.params.id]
                );

            if (
                image.rows.length > 0
            ) {

                await pool.query(
                    `
    DELETE FROM public.project_gallery
    WHERE id = $1
    `,
                    [req.params.id]
                );

                try {

                    await deleteFile(
                        "gallery",
                        image.rows[0].image_path
                    );

                } catch (err) {

                    console.error(
                        "Gallery image delete failed:",
                        err
                    );

                }

            }

            await pool.query(
                `
        DELETE FROM public.project_gallery
        WHERE id = $1
        `,
                [req.params.id]
            );

            res.json({
                message:
                    "Image Deleted",
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

module.exports =
    router;