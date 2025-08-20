const express = require("express")
const connectDB = require("./config/db")
require("dotenv").config()

const app = express()
app.use(express.json())
const authRoutes = require("./route/authRoutes")

connectDB()

app.get("/", (req, res) =>{
    res.send('api funcionando')
})

app.use("/api/auth", authRoutes)

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000")
})

