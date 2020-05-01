const mysql = require("mysql");

const connection = mysql.createConnection({
    host: `${process.env.JM_HOST}`,
  
    port: process.env.JM_PORT,
  
    user: `${process.env.JM_USER}`,
  
    // Your password
    password: `${process.env.JM_PASSWORD}`,
    database: `${process.env.JM_DATABASE}`
  });

  module.exports = connection;