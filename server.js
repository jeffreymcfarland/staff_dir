require("dotenv").config();

const chalkAnimation = require("chalk-animation");

const figlet = require("figlet");

const cTable = require("console.table");

const connection = require("./js/connection.js");

const inquirer = require("inquirer");

//========================================================================================
// CONNECT to sql server
connection.connect(function(err) {
    if (err) throw err;
    
    // CREATE title in terminal
    figlet("STAFF DIRECTORY", function(err, data) {
        if (err) throw err;

        animation("\n\n" + data + "\n\n");
    });

    const animation = (data) => {

        
        const rainbow = chalkAnimation.karaoke(data, 2);

        setTimeout(() => {
            rainbow.stop(); // Animation stops
        }, 2700);

        setTimeout(() => {
            start(); // Application starts
        }, 2700);
    };

});

//========================================================================================
// START function to initiate inquirer prompt


const start = () => {
    inquirer.prompt([
        {
            name: "start",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View Employees By Departments", "View Employees By Role", "Add Employee", "Remove Employee", "Add Department", "Remove Department", "Add Role", "Remove Role", "Update Employee Role", "Update Employee Manager", "EXIT"]
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
        } else if(answer.start === "Add Department") {
            addDep();
        } else if(answer.start === "Remove Department") {
            removeDep();
        } else if(answer.start === "Add Role") {
            addRole();
        } else if(answer.start === "Remove Role") {
            removeRole();
        } else if(answer.start === "Update Employee Role") {
            updateEmpRole();
        } else if(answer.start === "Update Employee Manager") {
            updateEmpMan();
        } else {
            connection.end();
        };
    });
}

//========================================================================================
// VIEW ALL function

const viewAll = () => {

    var sql = "SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.dep_name AS department, role.salary AS salary, manager.name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN manager ON employee.manager_id = manager.employee_id ORDER BY id";

    connection.query(sql, function(err, res) {
        if (err) throw err;  
        
        console.log("\n")
        console.table(res);

        start();

    });    
};

//========================================================================================
// VIEW BY DEPARTMENT function

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
                    var sql = "SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.dep_name AS department, role.salary AS salary, manager.name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN manager ON employee.id = manager.employee_id LEFT JOIN department ON role.department_id = department.id ORDER BY id";

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
// VIEW BY ROLE function 

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
                    var sql = "SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.dep_name AS department, role.salary AS salary, manager.name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN manager ON employee.id = manager.employee_id LEFT JOIN department ON role.department_id = department.id ORDER BY id";

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
// ADD NEW EMPLOYEE function

const addEmp = () => {

    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;

        let titleArray = [];
    
        for(let i=0; i < res.length; i++) {
            titleArray.push(res[i].title);
        };

        connection.query("SELECT * FROM manager", function(err, result) {
            if (err) throw err;

            let namesArray = ["None.", "This person is a manager."];

            for(let i=0; i < result.length; i++) {
                namesArray.push(result[i].name);
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

                let roleID = "";

                for(let i=0; i < res.length; i++) {
                    if(answer.role === res[i].title) {
                        roleID = res[i].id;
                    };
                };

                let managerID = "";

                for(let i=0; i < result.length; i++) {
                    if(answer.manager === result[i].name) {
                        managerID = result[i].employee_id;
                    } else {
                        managerID = null;
                    };
                };
                
                connection.query("INSERT INTO employee SET ?", {first_name: answer.firstName, last_name: answer.lastName, role_id: roleID, manager_id: managerID}, function (err, res) {
                    if (err) throw err;
                    if(answer.manager === "This person is a manager.") {

                        let employeeID = "";

                        connection.query("SELECT * FROM employee", function(err, res) {
                            if (err) throw err;
                            for(let i=0; i < res.length; i++){
                                if(answer.firstName === res[i].first_name) {

                                    employeeID = res[i].id;

                                    connection.query("INSERT INTO manager SET ?", {name: `${answer.firstName} ${answer.lastName}`, employee_id: employeeID}, function (err, res) {
                                        if (err) throw err;
                                    });
                                }
                            }
                            
                        });
                    };
                    console.log("Employee Added!");
                    start();
                });
    
            });
        });
    });
};

//========================================================================================
// REMOVE EMPLOYEE function

const removeEmp = () => {

    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;

        let empArray = ["CANCEL"];
    
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

            if(answer.name === "CANCEL") {
                start();
            } else {
                let empID = "";
                for(let i=0; i < res.length; i++) {
                    if(answer.name === `${res[i].first_name} ${res[i].last_name}`) {
                        empID = res[i].id;
                    };
                };
                
                connection.query("DELETE FROM employee WHERE ?", {id: empID}, function (err, res) {
                    if (err) throw err;
                    console.log("Employee Removed!");
                    start();
                });
            };
        });
    });
};

//========================================================================================
// ADD NEW DEPARTMENT function

const addDep = () => {

    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "department",
                type: "input",
                message: "What department would you like to add?"
            }
        ]).then(function(answer) {
            
            connection.query("INSERT INTO department SET ?", {dep_name: answer.department}, function (err, res) {
                if (err) throw err;
                console.log("Department Added!");
                start();
            });

        });
    });
};

//========================================================================================
// REMOVE DEPARTMENT function 

const removeDep = () => {

    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;

        let depArray = ["CANCEL"];
        for( let i=0; i < res.length; i++) {
            depArray.push(res[i].dep_name);
        };

        inquirer.prompt([
            {
                name: "department",
                type: "list",
                message: "Which department would you like to remove?",
                choices: depArray
            }
        ]).then(function(answer) {

            if(answer.department === "CANCEL") {
                start();
            } else {
                connection.query("DELETE FROM department WHERE ?", {dep_name: answer.department}, function (err, res) {
                    if (err) throw err;
                    console.log("Department Removed!");
                    start();
                });
            };
        });
    });
};

//========================================================================================
// ADD NEW ROLE function

const addRole = () => {

    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;

        connection.query("SELECT * FROM department", function(err, res) {

            let depArray = [];
            for(let i=0; i < res.length; i++) {
                depArray.push(res[i].dep_name);
            };

            inquirer.prompt([
                {
                    name: "role",
                    type: "input",
                    message: "What role would you like to add?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the yearly salary for this role?"
                },
                {
                    name: "dep",
                    type: "list",
                    message: "What department does this role work in?",
                    choices: depArray
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
                    
                    connection.query("INSERT INTO role SET ?", {title: answer.role, salary: answer.salary, department_id: id}, function (err, res) {
                        if (err) throw err;
                        console.log("Role Added!");
                        start();
                    });
                });
            });
        });
    });
};

//========================================================================================
// REMOVE ROLE function 

const removeRole = () => {

    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;

        let roleArray = ["CANCEL"];
        for( let i=0; i < res.length; i++) {
            roleArray.push(res[i].title);
        };

        inquirer.prompt([
            {
                name: "role",
                type: "list",
                message: "Which role would you like to remove?",
                choices: roleArray
            }
        ]).then(function(answer) {

            if(answer.role === "CANCEL") {
                start();
            } else {
                connection.query("DELETE FROM role WHERE ?", {title: answer.role}, function (err, res) {
                    if (err) throw err;
                    console.log("Role Removed!");
                    start();
                });
            };
        });
    });
};

//========================================================================================
// UPDATE EMPLOYEE function 

const updateEmpRole = () => {

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
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Is this a manager role?",
                    choices: ["Yes", "No"]
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

                    if(answer.manager === "Yes") {
                        connection.query("INSERT INTO manager SET ?", {name: answer.selected, employee_id: empID}, function (err, res) {
                            if (err) throw err;
                        });
                    };

                    console.log("Role Updated!");
                    start();
                });
            
            });
        });
    });
};

//========================================================================================
// UPDATE EMPLOYEE MANAGER function

const updateEmpMan = () => {

    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;

        let selectArray = [];
        for(let i=0; i < res.length; i++) {
            selectArray.push(`${res[i].first_name} ${res[i].last_name}`);
        };

        connection.query("SELECT * FROM manager", function(err, result) {
            if (err) throw err;

            let manArray = [];
            for(let i=0; i < result.length; i++) {
                manArray.push(result[i].name);
            };

            inquirer.prompt([
                {
                    name: "selected",
                    type: "list",
                    message: "Which employee's manager would you like to update?",
                    choices: selectArray
                },
                {
                    name: "update",
                    type: "list",
                    message: "Which staff member is their new manager?",
                    choices: manArray
                }
            ]).then(function(answer) {
    
                let empID = "";
                for(let i=0; i < res.length; i++) {
                    if (answer.selected === `${res[i].first_name} ${res[i].last_name}`) {
                        empID = res[i].id;
                    };
                };
    
                let managerID = "";
                for(let i=0; i < result.length; i++) {
                    if (answer.update === result[i].name) {
                        managerID = result[i].employee_id;
                    };
                };
    
                connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerID, empID], function (err, result) {
                    if (err) throw err;
                    console.log("Role Updated!");
                    start();
                });
               
            });
        })
    });
};