const express = require("express");
const router = express.Router();

const pool =
  require("../config/db");



/* Add Update */

router.post(
  "/",
  async (req, res) => {

    try {

      const {
        project_id,
        update_text,
      } = req.body;

      const result =
        await pool.query(
          `
          INSERT INTO
          project_updates
          (
            project_id,
            update_text
          )
          VALUES
          ($1,$2)
          RETURNING *
          `,
          [
            project_id,
            update_text,
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

/* Get Updates */

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
          FROM project_updates
          WHERE project_id = $1
          ORDER BY created_at DESC
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

/* Delete Update */

router.delete(
  "/:id",
  async (req, res) => {

    try {

      await pool.query(
        `
        DELETE FROM
        project_updates
        WHERE id = $1
        `,
        [req.params.id]
      );

      res.json({
        message:
          "Update deleted",
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