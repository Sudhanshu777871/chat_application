const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require('bcryptjs');
const config = require("./config");
require("dotenv").config();
// applying the middleware
app.use(express.json());
app.use(cors());

// CREATING THE LOGIN API
app.post("/login", (req, res) => {
    if (req.body.email && req.body.password) {
      const { email, password } = req.body;
  
      // Query the database to find the user by phone
      config.query(
        "SELECT * FROM user WHERE Email = ?",
        [email],
        async (error, results) => {
          if (error) {
            throw error;
          } else if (results.length === 0) {
            res.status(401).send({ errMsg: "User not found" });
          } else {
            const user = results[0];
            const storedPassword = user.Password;
  
            // Compare the provided password with the hashed password
            try {
              const passwordMatch = await bcrypt.compare(password, storedPassword);
  
              if (passwordMatch) {
                res.send(true);
              } else {
                res.status(401).send({ errMsg: "Invalid password" });
              }
            } catch (err) {
              console.error(err);
              res.status(500).send({ errMsg: "Login failed" });
            }
          }
        }
      );
    } else {
      res.status(400).send({ errMsg: "Please Enter Both Email and Password" });
    }
  });

// code for api for signup
app.post("/account", (req, res) => {
    if (req.body.username && req.body.email && req.body.password) {
        const { username, email, password } = req.body;

        // Check if the phone number is already registered
        config.query(
            "SELECT * FROM user WHERE Email = ?",
            [email],
            async (error, results) => {
                if (error) {
                    throw error;
                } else if (results.length > 0) {
                    res.status(400).send({ errMsg: "Email Already Exits" });
                } else {
                    // Hash the password
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Insert the new user into the database
                    config.query(
                        "INSERT INTO user (UserName, Email, Password) VALUES (?, ?, ?)",
                        [username, email, hashedPassword],
                        (error) => {
                            if (error) {
                                throw error;
                            }
                            res.send(true);
                        }
                    );
                }
            }
        );
    } else {
        res.status(400).send({ errMsg: "Please Enter Name, Email, and Password" });
    }
});

// CODE FOR VALIDATING THE USEREMAIL FOR NEW CHAT 
app.post("/email_validate", (req, res) => {
  if(req.body.email){
    const {email} = req.body;
    config.query(
      "SELECT Email FROM user WHERE Email=?",[email],
      (error, result) => {
        if (error) throw error;
        res.send(result);
      }
    );
  }
  else{
    res.send("Please Send The Email")
  }
});
// Listening The App
app.listen(process.env.RUNNING_PORT);