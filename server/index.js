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
app.use(express.urlencoded({ extended: true }));

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

// app.post('/signup' , (req , res)=>{
//     // const email = req.body.email
//     // const password = req.body.password

//     console.log("REQ: ", req)
//     // console.log("EMAIL: ", email)
//     // console.log("PASSWORD: ", password)

//    res.send('hello from simple server :)')
// })

// ここでres.sendすると、ブラウザに新しいページが表示されるんだね
// 逆に、app.postでres.sendしてもブラウザ上の変化はない
app.post('/signup', (req, res) => {
    // console.log("FIRST NAME POST: ", req.body.firstName)
    // console.log("LAST NAME POST: ", req.body.lastName)
    // console.log("EMAIL POST: ", req.body.email)
    // console.log("PASSWORD POST: ", req.body.password)
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log("COULD NOT CREATE HASH: ", err);
        }
        db.query(
            "INSERT INTO users (f_name, l_name, email, password) VALUES (?, ?, ?, ?)",
            [firstName, lastName, email, hash],
            (err, results) => {
                if (err) {
                    console.log("COULD NOT INSERT USER: ", err);
                    res.redirect('/signup')
                } else {
                    console.log("USER ADDED");
                    res.redirect("/dashboard")
                }
            }
        )
    })

    // res.end()
    // res.redirect('http://localhost:3000')
    // プロキシ設定したので、これはhttp://localhost:3000にリダイレクトされる
    // res.redirect('/')
})

app.get('/signup', (req, res) => {
    res.send("GET WAS IMPLEMENTED")
})

app.listen(3001, () => {
    console.log("SERVER IS RUNNING");
})