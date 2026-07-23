import express from "express";
import cors from "cors";

const App = express();
const PORT = 5050;

App.set("view engine", "ejs");
App.use(express.static("public"));
App.use(express.urlencoded({ extended: true }));
App.use(cors());
App.get("/", (req, res) => {
  res.render("index.ejs");
});
App.get("/upload", (req, res) => {
  res.render("/pages/uploadCsv.html");
});

App.listen(PORT, () => {
  console.log(`\t Frontend on port ${PORT}`);
});
