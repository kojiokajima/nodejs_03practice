const express = require("express")
const mmysql = require("mysql2")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const session = require("express-session")
const cookieParser = require("cookie-parser")

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
    key: "tokenYOYO",
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     expiresIn: 60 * 60 * 2
    // },
}))

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
                    console.log("RESULT: ", results)
                    res.redirect("/dashboard/" + results.insertId)
                }
            }
        )
    })
})

const verifyJWT = (req, res, next) => {
    // const token = req.headers["x-access-token"]
    const token = req.session.token
    // console.log("REQ.SESSION.JWTTOKEN: ", req.session.jwttoken)

    // console.log("-------------------------------");
    // console.log("REQ: ", req);
    // console.log("-------------------------------");

    if (!token) {
        console.log("TOKEN IS MISSING");
        res.send("Yo, you need a token.")
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
    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, result) => {
            if (err) {
                console.log("ERRRRRR?");
                res.send({ err: err })
            }

            if (result.length > 0) {
                console.log("LENGTH IS GREATER THAN 0");
                // console.log(result);
                bcrypt.compare(password, result[0].password, (error, response) => {
                    // このresponseは、trueかfalseを返してる
                    if (response) {
                        // console.log("RSPONSE(crypt): ", response);
                        // console.log("RESULT(db): ", result);
                        const id = result[0].id
                        const token = jwt.sign({ id }, process.env.NODE_JWT_SECRET, {
                            expiresIn: 300,
                        })
                        // req.session.jwttoken = result
                        req.session.token = token
                        req.session.firstName = result[0].f_name
                        req.session.lastName = result[0].l_name
                        req.session.email = result[0].email
                        req.session.uid = result[0].id
                        // console.log("RESPONSE: ", result[0]);
                        // console.log("TYPE: ", typeof (req.session.id));
                        // console.log("TYPE: ", typeof (req.session.id));
                        // console.log("TOKEN: ", req.session.jwttoken);
                        // console.log("TOKENNN: ", token)



                        // console.log("REQ: ", req);
                        // console.log("REQ.SESSION: ", req.session);
                        // req.locals.token = token
                        res.redirect('/dashboard/' + req.session.id)
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

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            log("ERRRRR: ", err)
        }
        // res.redirect('/')
        res.send("YOOOOOOOO")
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.listen(port, (req, res) => {
    console.log("SERVER IS RUNNING ON ", port);
})