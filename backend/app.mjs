import express from "express";
import cors from "cors";
import indexRoute from "./modules/index.route.mjs";

const App = express();
const PORT = 9090;

App.use(cors());
App.use(express.json({ limit: "10mb" }));
App.use("/api", indexRoute);

App.listen(PORT, () => {
  console.log(`\t ONLINE on port ${PORT}`);
});
