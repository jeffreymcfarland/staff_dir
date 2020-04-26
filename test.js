require('dotenv').config();

const cTable = require('console.table');

const mysql = require("mysql");

const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: `${process.env.JM_HOST}`,

  port: process.env.JM_PORT,

  user: `${process.env.JM_USER}`,

  // Your password
  password: `${process.env.JM_PASSWORD}`,
  database: `${process.env.JM_DATABASE}`
});

// CONNECT to sql server
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // Call function with first prompt
    
    test();
});

// LEFT JOIN department ON role.department_id = department.id
// department.dep_name AS department,

// WHERE department.dep_name = Marketing

const test = () => {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "dep",
                type: "input",
                message: "What department does this role work in?"
            }
        ]).then(function(answer) {

            connection.query("SELECT * FROM department", function(err, res) {
                if (err) throw err;

                let id = "";

                for(let i=0; i < res.length; i++) {
                    if(answer.dep === res[i].dep_name) {
                        id = res[i].id;
                    };
                };

                console.log(id);
            });

        });
    });
};


// connection.end();