import app from "./app.js";
import connectDatabase from "./database/database.js";

import CronJob from "./tasks/cron.job..js"

import dotenv from "dotenv"

dotenv.config({path: "/env"})

CronJob.start()


connectDatabase().then(()=>{
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`Server is running: ${process.env.PORT}`)
    })

    app.get("/", (req, res) => {
        res.send("Hello from server")
    })
}).catch((error)=>{
    console.log("Server connection is failed", error)
})