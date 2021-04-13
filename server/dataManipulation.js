const express = require("express")
const { Pool } = require("pg")
const port = 3003

const app = express()
require("dotenv").config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

pool.connect((err, db) => {
  if (err) {
      console.log("FAILED TO CONNECT TO BATABASE");
      console.log(err);
  } else {
      console.log("CONNECTED TO DATABASE");
      // db.query(
      //   "SELECT * from users",
      //   (err, result) => {
      //     if(err) {
      //       console.log("COULD NOT FETCH DATA");
      //     } else {
      //       console.log("RESULTS:");
      //       console.log(result.command);
      //       console.log(result.rows); // これが配列
      //     }
      //   }
      // )
      db.query(
        "SELECT * FROM users WHERE id = 1",
        (err, result) => {
          console.log("RESULT: ", result.rows[0]);
        }
      )

  }
})

app.listen(port, (req, res) => {
  console.log("SERVER IS RUNNING ON ", port);
})