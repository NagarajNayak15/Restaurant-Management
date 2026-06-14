import express from "express"
import Cors from "cors"

const app=express()
app.use(Cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("hello")
})
app.listen(3000);