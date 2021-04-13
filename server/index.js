const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const path = require("path")
// ------------------------------------------------------
// const pg = require("pg")
const { Pool } = require("pg")
const e = require("express")
// ------------------------------------------------------

const port = process.env.PORT || 3001
const app = express()
require("dotenv").config()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(session({
    key: "token",
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // expiresIn: 60
        // maxAge: 1000 * 60 * 60
        maxAge: 1000 * 60 * 60 // --> 5分ってこと
    },
}))

// --------------SET UP CONFIGRATION OF DB--------------
// const db = mysql.createConnection({
//     user: process.env.NODE_USER,
//     host: process.env.NODE_HOST,
//     password: process.env.NODE_PASSWORD,
//     database: process.env.NODE_DATABASE,
//     port: process.env.NODE_PORT
// })

// const db = require("./db")
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
// --------------/SET UP CONFIGRATION OF DB--------------

// --------------CREATE CONNECTION TO DB--------------
// db.connect((err, res) => {
//     if (err) {
//         console.log("FAILED TO CONNECT TO BATABASE");
//         console.log(err);
//     } else {
//         console.log("CONNECTED TO DATABASE");
//     }
// })
pool.connect((err, res) => {
    if (err) {
        console.log("FAILED TO CONNECT TO BATABASE");
        console.log(err);
    } else {
        console.log("CONNECTED TO DATABASE");
    }
})
// --------------/CREATE CONNECTION TO DB--------------

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
        pool.connect((err, db) => {
            db.query(
                "INSERT INTO users (f_name, l_name, email, password) VALUES ($1, $2, $3, $4)",
                [firstName, lastName, email, hash],
                (err, results) => {
                    if (err) {
                        console.log("COULD NOT INSERT USER: ", err);
                        res.redirect('/signup')
                    } else {
                        console.log("USER ADDED");
                        // console.log("RESULT: ", results)
                        // db.query(
                        //     "SELECT * FROM users WHERE email = $1",
                        //     [email],
                        //     (err, result) => {
                        //         if (err) {
                        //             console.log("USER ADDED BUT FAILDED TO FETCH");
                        //         } else {
                        //             res.redirect("/dashboard/" + result.rows[0].id)
                        //         }
                        //     }
                        // )

                        // res.redirect("/dashboard/" + results.insertId)
                        res.redirect('/signin')
                    }
                }
            )
        })
    })
})

const verifyJWT = (req, res, next) => {
    // const token = req.headers["x-access-token"]
    const token = req.session.token
    // console.log("TOKENNN: ", token);
    // console.log("REQ.SESSION.JWTTOKEN: ", req.session.jwttoken)

    // console.log("-------------------------------");
    // console.log("REQ: ", req);
    // console.log("-------------------------------");

    if (!token) {
        console.log("TOKEN IS MISSING");
        // res.send("Yo, you need a token.")
        res.redirect('/')

    } else {
        jwt.verify(token, process.env.NODE_JWT_SECRET, (err, decoded) => {
            if (err) {
                res.json({ auth: false, message: "U failed to authenticate" })
            } else {
                // console.log("-------------------------------");
                // console.log("REQ: ", req);
                // req.userId = decoded.id

                // req.session.id = String(decoded.id)
                // console.log("DECODED: ", String(decoded.id));

                // console.log("DECODED.ID: ", decoded.id);
                // console.log("REQ: ", req);
                // console.log("rREQ.USERID: ", req.userId);
                // console.log("-------------------------------");
                next()
            }
        })
    }
}

app.get('/login', verifyJWT, (req, res) => {
    // res.json({auth: true, uid: "get"})
    // res.send("HIII")
    if (req.session.token) {
        res.send({
            loggedIn: true,
            token: req.session.token,
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            email: req.session.email,
            id: req.session.uid
        })
    } else {
        res.send({ liggedIn: false })
    }
})

app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // console.log("EMAIL: ", email)
    // console.log("PASSWORD: ", password);
    // res.json({auth: false, uid: "post"})
    pool.connect((err, db) => {
        db.query(
            'SELECT * FROM users WHERE email = $1',
            [email],
            (err, result) => {
                if (err) {
                    console.log("ERRRRRR?");
                    res.send({ err: err })
                }

                if (result.rows.length > 0) { // ---------------------------------------
                    console.log("LENGTH IS GREATER THAN 0");
                    // console.log(result);
                    bcrypt.compare(password, result.rows[0].password, (error, response) => {
                        // このresponseは、trueかfalseを返してる
                        if (response) {
                            // console.log("RSPONSE(crypt): ", response);
                            // console.log("RESULT(db): ", result);
                            const id = result.rows[0].id
                            const token = jwt.sign({ id }, process.env.NODE_JWT_SECRET, {
                                // expiresIn: 300,
                                expiresIn: '2h'
                            })
                            // req.session.jwttoken = result
                            req.session.token = token
                            req.session.firstName = result.rows[0].f_name
                            req.session.lastName = result.rows[0].l_name
                            req.session.email = result.rows[0].email
                            req.session.uid = result.rows[0].id
                            // console.log("RESPONSE: ", result[0]);
                            // console.log("TYPE: ", typeof (req.session.id));
                            // console.log("TYPE: ", typeof (req.session.id));
                            // console.log("TOKEN: ", req.session.jwttoken);
                            // console.log("TOKENNN: ", token)



                            // console.log("REQ: ", req);
                            // console.log("REQ.SESSION: ", req.session);
                            // req.locals.token = token
                            res.redirect('/dashboard/' + req.session.uid)
                            // res.redirect("/dashboard")
                            // res.send(token)
                        } else {
                            res.json({ auth: false, message: "wrong email/password combination" })
                        }
                    })
                } else {
                    res.json({ auth: false, message: "no user exist" })
                }
            }
        )
    })
})

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            log("ERRRRR: ", err)
        }
        // res.redirect('/')
        res.send("YOOOOOOOO")
    })
})

app.post('/post', (req, res) => {
    // content = req.body.content;
    // localStorage.getItem("id");
    const content = req.body.content
    const uid = req.session.uid
    // console.log("CONTENT: ", content)
    // console.log("ID: ", uid);

    pool.connect((er, db) => {
        if (er) {
            console.log("NOT CONNECTED TO DB");
            console.log(er);
            res.send("FAILED TO CONNECT TO DATABASE")
        } else {
            db.query(
                'INSERT INTO posts (user_id, content) VALUES ($1, $2)',
                [uid, content],
                (err, result) => {
                    if (err) {
                        console.log("FAILED TO INSERT POST")
                        console.log(error);
                        res.send("ERROR IN INSERTING POST")
                    } else {
                        console.log("POST ADDED!");
                        res.redirect('/dashboard/' + uid)
                    }
                }
            )
        }
    })

    // pool.connect((err, db) => {
    //     db.query((err, res) => {
    //         'INSERT INTO posts (user_id, content) VALUES ($1, $2)',
    //         []
    //     })
    // })

    // res.redirect('/dashboard/' + req.session.uid)
})

app.get('/getpost', (req, res) => {
    // console.log("/GETPOST CALLED");
    pool.connect((err, db) => {
        if (err) {
            console.log("NOT CONNECTED TO DB");
            res.send("NOT CONNECTED TO DB")
        } else {
            db.query(
                'SELECT * FROM posts',
                (error, results) => {
                    if (error) {
                        console.log("COULD NOT GET DATA");
                        res.send("COULD NOT GET DATA")
                    } else {
                        console.log("DATABESE: ", results.rows);
                        // if (results.rows.length > 0) {
                            res.send(results.rows)
                        // }
                    }
                }
            )
        }
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.listen(port, (req, res) => {
    console.log("SERVER IS RUNNING ON ", port);
})