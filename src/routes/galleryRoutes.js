const express =
    require("express");

const router =
    express.Router();

const multer =
    require("multer");

const fs =
    require("fs");

const pool =
    require("../config/db");

const storage =
    multer.diskStorage({

        destination(
            req,
            file,
            cb
        ) {

            const folder =
                `uploads/gallery/project-${req.body.project_id}`;

            fs.mkdirSync(
                folder,
                {
                    recursive: true,
                }
            );

            cb(
                null,
                folder
            );

        },

        filename(
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

const upload =
    multer({
        storage,
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

            const result =
                await pool.query(
                    `
          INSERT INTO project_gallery
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
                        req.file.originalname,
                        req.file.path,
                        caption,
                    ]
                );

            res.json(
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
          FROM project_gallery
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
          FROM project_gallery
          WHERE id = $1
          `,
                    [req.params.id]
                );

            if (
                image.rows.length > 0
            ) {

                if (
                    fs.existsSync(
                        image.rows[0].image_path
                    )
                ) {

                    fs.unlinkSync(
                        image.rows[0].image_path
                    );

                }

            }

            await pool.query(
                `
        DELETE FROM project_gallery
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