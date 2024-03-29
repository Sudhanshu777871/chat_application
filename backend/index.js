const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require('bcryptjs');
const config = require("./config");
let nameSpace = '';
require("dotenv").config();
// code for socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});
// applying the middleware
app.use(express.json());
app.use(cors());

// code for creating the namespace
io.on("create_namespace", (data) => {
  nameSpace = io.of(`/${data}`)
})
// CODE FOR SOCKET.IO

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('test', "A Message From Backend Of Code");

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// CODE FOR MAKING API
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
  if (req.body.email) {
    const { email } = req.body;
    config.query(
      "SELECT Email FROM user WHERE Email=?", [email],
      (error, result) => {
        if (error) throw error;
        res.send(result);
      }
    );
  }
  else {
    res.send("Please Send The Email")
  }
});

// code for making API for inserting the json data to connected data
app.post("/insert_connected_people", (req, res) => {
  if (req.body.adminEmail && req.body.connectedEmail) {
    const { adminEmail, connectedEmail } = req.body;
    // code for getting the name of connected user using email
    config.query('SELECT UserName FROM user WHERE Email=?', [connectedEmail], (error, result) => {
      if (error) {
        res.status(500).send('Some Error During Fetching Of User Name');
        return;
      } else {
        console.log(result[0].UserName)
        // code for inserting the connected user data
        config.query("INSERT INTO peopleconnect (adminEmail, connectedPersonEmail, connectedPersonName) VALUES (?,?,?)", [adminEmail, connectedEmail, result[0].UserName], (err) => {
          if (err) {
            res.status(500).send("Some, Please Try Again...");
            return;
          } else {
            res.status(200).send(true);
          }
        });
      }

    })

  } else {
    res.status(400).send("Please send the Admin Email, Connected Email, and Connected Name");
  }
});

// code for making API for showing all the users
app.post("/show_all_users", (req, res) => {
  if (req.body.userEmail) {
    const { userEmail } = req.body;
    // code for showing all connected users
    config.query("SELECT connectedPersonEmail, connectedPersonName FROM peopleconnect WHERE adminEmail=?", [userEmail], (err, result) => {
      if (err) {
        res.status(500).send("Some, error occures, please try again...");
        return;
      } else {
        res.status(200).send(result);
      }
    })
  }
  else {
    res.status(400).send("Please Send The User Name  Of User");
  }
})

// code for making api for inserting the chat msg
app.post("/insert_msg", (req, res) => {
  if (req.body.senderEmail && req.body.reciverEmail && req.body.msg) {
    const { senderEmail, reciverEmail, msg } = req.body;
    config.query(
      "INSERT INTO master_msg (senderEmail,reciverEmail,msg) VALUES (?,?,?)",
      [senderEmail, reciverEmail, msg],
      (error, result) => {
        if (error) {
          res.status(500).send("Some, error occures, please try again...");
          return;
        } else {
          res.status(200).send(result);
        }
      }
    );
  }
  else {
    res.status(400).send("Please Send The Send Email, Reciver Email and Msg");
  }
});


// Listening The App
http.listen(process.env.RUNNING_PORT);