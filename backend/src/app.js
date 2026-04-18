const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "HostelHub backend running" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API working fine" });
});

app.use("/api", routes);

module.exports = app;