import express from "express";
import {fibonacci} from "./heavyComputation.mjs";   
import cluster from "cluster";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set("view engine","ejs")

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    console.log(`landing page: ${process.pid}`)
    res.send("Landing page")
})

app.get("/admin", (req, res) => {
    const workers = Object.values(cluster.workers);
    const allWorkerData = workers.map(worker=> {
        return {
            workerId: worker.id,
            pid: worker.process.pid,
        }
    })

    return res.render("admin", {allWorkerData: allWorkerData});
});

// Define routes and middleware
app.get('/heavy', (req, res) => {
    for(let i=0;i<10;i++) {
        fibonacci(10000);
    }
    
  res.send('Hello World!');
});



export default app;