const express = require("express")
const mmysql = require("mysql2")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()
require("dotenv").config()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.urlencoded({extended: true}));

const db = mmysql.createConnection({
    user: process.env.NODE_USER,
    host: process.env.NODE_HOST,
    password: process.env.NODE_PASSWORD,
    database: process.env.NODE_DATABASE,
    port: process.env.NODE_PORT
})

db.connect((err, res) => {
    if (err) {
        console.log("FAILED TO CONNECT TO BATABASE");
        console.log(err);
    } else {
        console.log("CONNECTED TO DATABASE");
    }
})

app.post('/signup' , (req , res)=>{
   res.send('hello from simple server :)')
})





app.listen(3001, () => {
    console.log("SERVER IS RUNNING");
})