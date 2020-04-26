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

//========================================================================================
// CONNECT to sql server
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // Call function with first prompt
    start();
});

//========================================================================================
// START function to initiate inquirer prompt
const start = () => {
    inquirer.prompt([
        {
            name: "start",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View Employees By Departments", "View Employees By Role", "Add Employee", "Remove Employee", "Update Employee Department", "Update Employee Role", "Update Employee Manager", "EXIT"]
        }
    ]).then(function(answer) {
        if(answer.start === "View All Employees") {  
            viewAll();   
        } else if(answer.start === "View Employees By Departments") {     
            viewDep();       
        } else if(answer.start === "View Employees By Role") {
            viewRole();
        } else if(answer.start === "Add Employee") {
            addEmp();
        } else if(answer.start === "Remove Employee") {
            removeEmp();
        } else if(answer.start === "Update Employee Department") {
            start();
        } else if(answer.start === "Update Employee Role") {
            start();
        } else if(answer.start === "Update Employee Manager") {
            start();
        } else {
            connection.end();
        };
    });
};

//========================================================================================
// VIEW ALL function for prompt to allow user to select which data to view from server

const viewAll = () => {

    var sql = "SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.dep_name AS department, role.salary AS salary, manager.name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN manager ON employee.id = manager.employee_id";

    connection.query(sql, function(err, res) {
        if (err) throw err;  
        
        console.log("\n")
        console.table(res);

        start();

    });    
};

//========================================================================================
// VIEW DEPARTMENT function for prompt to allow user to select which data to view from server

const viewDep = () => {

    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;

        let depArray = [];
    
        for(let i=0; i < res.length; i++) {
            depArray.push(res[i].dep_name);
        };

        inquirer.prompt([
            {
                name: "all",
                type: "list",
                message: "Which department would you like to view?",
                choices: depArray
            }
        ]).then(function(answer) {
            for(let i=0; i<depArray.length; i++) {
                if(answer.all === depArray[i]) {
                    var sql = "SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.dep_name AS department, role.salary AS salary, manager.name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN manager ON employee.id = manager.employee_id LEFT JOIN department ON role.department_id = department.id";

                    let depSelect = [];

                    connection.query(sql, function(err, res) {
                        if (err) throw err;  

                        for(let i=0; i<res.length; i++) {
                            if(res[i].department === answer.all) {
                                depSelect.push(res[i]);
                            }
                        }
                        console.log("\n");
                        console.table(depSelect);

                        start();

                    });    
                };
            };
        });
    });  
};

//========================================================================================
// VIEW ROLE function for prompt to allow user to select which data to view from server

const viewRole = () => {

    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;

        let roleArray = [];
    
        for(let i=0; i < res.length; i++) {
            roleArray.push(res[i].title);
        };

        inquirer.prompt([
            {
                name: "all",
                type: "list",
                message: "Which role would you like to view?",
                choices: roleArray
            }
        ]).then(function(answer) {
            for(let i=0; i<roleArray.length; i++) {
                if(answer.all === roleArray[i]) {
                    var sql = "SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.dep_name AS department, role.salary AS salary, manager.name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN manager ON employee.id = manager.employee_id LEFT JOIN department ON role.department_id = department.id";

                    let roleSelect = [];

                    connection.query(sql, function(err, res) {
                        if (err) throw err;  

                        for(let i=0; i<res.length; i++) {
                            if(res[i].title === answer.all) {
                                roleSelect.push(res[i]);
                            }
                        }
                        console.log("\n");
                        console.table(roleSelect);

                        start();

                    });    
                };
            };
        });
    });  
};


//========================================================================================
// ADD function for prompt to allow user to select with data to view from server

const addEmp = () => {

    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;

        let titleArray = [];
    
        for(let i=0; i < res.length; i++) {
            titleArray.push(res[i].title);
        };

        connection.query("SELECT * FROM manager", function(err, res) {
            if (err) throw err;

            let namesArray = ["None"];

            for(let i=0; i < res.length; i++) {
                namesArray.push(res[i].name);
            };

            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is their role?",
                    choices: titleArray
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is their manager?",
                    choices: namesArray
                }
            ]).then(function(answer) {
                
                console.log(answer);
    
            });
        });
    });
};


//========================================================================================
// ADD function for prompt to allow user to select with data to view from server

const removeEmp = () => {

    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;

        let empArray = [];
    
        for(let i=0; i < res.length; i++) {
            empArray.push(`${res[i].first_name} ${res[i].last_name}`);
        };

        inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Which employee which you like to remove?",
                choices: empArray
            }
        ]).then(function(answer) {
            
            console.log(answer);

        });
    });
};
