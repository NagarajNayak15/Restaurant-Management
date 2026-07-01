import express from "express"
import Cors from "cors"
import verify from "./middleware/auth.js";
import menuRoutes from "./routes/menu.routes.js";
import tableRoutes from "./routes/table.routes.js";

const app=express()
app.use(Cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("hello")
})
app.post('/verify',verify)

app.use('/menu', menuRoutes);
app.use('/table', tableRoutes);
app.listen(8000);