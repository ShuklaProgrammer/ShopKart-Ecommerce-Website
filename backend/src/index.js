import app from "./app.js";
import connectDatabase from "./database/database.js";

import dotenv from "dotenv";

dotenv.config({ path: "/env" });

// CronJob.start()

connectDatabase()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("Hello from server");
    });
  })
  .catch((error) => {
    console.log("Server connection is failed", error);
  });
