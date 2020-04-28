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
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;

        let selectArray = [];
        for(let i=0; i < res.length; i++) {
            selectArray.push(`${res[i].first_name} ${res[i].last_name}`);
        };

        connection.query("SELECT * FROM role", function(err, result) {
            if (err) throw err;

            let roleArray = [];
            for(let i=0; i < result.length; i++) {
                roleArray.push(result[i].title);
            };

            inquirer.prompt([
                {
                    name: "selected",
                    type: "list",
                    message: "Which employee's role would you like to update?",
                    choices: selectArray
                },
                {
                    name: "update",
                    type: "list",
                    message: "Which of the following is their new role?",
                    choices: roleArray
                }
            ]).then(function(answer) {
    
                let empID = "";
    
                for(let i=0; i < res.length; i++) {
                    if (answer.selected === `${res[i].first_name} ${res[i].last_name}`) {
                        empID = res[i].id;
                    };
                };
    
                let roleID = "";
    
                for(let i=0; i < result.length; i++) {
                    if (answer.update === result[i].title) {
                        roleID = result[i].id;
                    };
                };
    
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, empID], function (err, result) {
                    if (err) throw err;
                    console.log("Role Updated!");
                });
                
            });
        })

        
    });
};


// connection.end();