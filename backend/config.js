const mysql = require("mysql");
// creting the connection
const connectionConnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "talktime",
});

// connecting to the database

connectionConnect.connect((err) => {
  if (err) {
    console.log(err);
  } 
});

// exporting the module
module.exports = connectionConnect;