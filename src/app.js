const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");

const customerRoutes =
  require("./routes/customerRoutes");

const app = express();

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

const PORT = 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});