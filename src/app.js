const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");

const customerRoutes =
  require("./routes/customerRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const documentRoutes =
  require(
    "./routes/documentRoutes"
  );
const updateRoutes =
  require(
    "./routes/updateRoutes"
  );
const fatReportRoutes =
  require("./routes/fatReportRoutes");

const authRoutes =
  require(
    "./routes/authRoutes"
  );
const customerAuthRoutes =
  require(
    "./routes/customerAuthRoutes"
  );

const galleryRoutes =
  require(
    "./routes/galleryRoutes"
  );

// customer auth routes

const customerProjects =
  require("./routes/customerProjects");

const departmentRoutes =
  require("./routes/hr/departmentRoutes");

// const customerProjectDetails =
// require("./routes/customerProjectDetails");

const app = express();

const path =
  require("path");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CES API Running");
});

app.use("/api/projects", projectRoutes);
app.use(
  "/api/customers",
  customerRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/uploads",
  express.static(
    "uploads"
  )
);

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../uploads"
    )
  )
);

app.use(
  "/api/updates",
  updateRoutes
);

app.use(
  "/api/fat-reports",
  fatReportRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/customer-auth",
  customerAuthRoutes
);

app.use(
  "/api/gallery",
  galleryRoutes
);
// customer portal routes
app.use(
  "/api/customer-projects",
  customerProjects
);

app.use(
  "/api/departments",
  departmentRoutes
);

// app.use(
//     "/api/customer/projects",
//     customerProjectDetails
// );

const PORT =
  process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});