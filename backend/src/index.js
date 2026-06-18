import express from "express"
import Cors from "cors"
import verify from "./middleware/auth.js";
import menuRoutes from "./routes/menu.routes.js";

const app=express()
app.use(Cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("hello")
})
app.post('/verify',verify)
app.use('/menu', menuRoutes);
app.listen(8000);