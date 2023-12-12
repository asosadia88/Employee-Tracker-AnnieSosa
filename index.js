//install libraries
const inquirer = require("inquirer");
const mysql = require("mysql2");
const {printTable} = require("console-table-printer");
require("dotenv").config();


const db = mysql.createConnection({
    //establish connection string
    host:"localhost",
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:3306
})
//callback function to connect to the database
db.connect(()=>{
    mainMenu()
})

//Function to display main menu of application
function mainMenu(){
    //Use inquirer to list options for user
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "selection",
        choices: ["View all departments","View all roles", "View all employees", "Add a department","Add a role", "Add an employee", "Update an employee role"]
    })
    //Whichever choice the user chooses calls a specific function defined below
    .then(answer => {
        if(answer.selection === "View all departments"){
            viewDepartments();
        }else if(answer.selection === "View all roles"){
            viewRoles();
        }else if(answer.selection === "View all employees"){
            viewEmployees();
        }else if(answer.selection === "Add a department"){
            addDepartment();
        }else if(answer.selection === "Add a role"){
            addRole();
        }else if(answer.selection === "Add an employee"){
            addEmployee();
        }else if(answer.selection === "Update an employee role"){
            updateEmployeeRole();
        }
    })
}

function viewDepartments(){
    //use query function to write sql code in javascript 
    //test queries in queries file before using in these functions
    db.query(`SELECT * FROM department;`, (err, data)=>{
        //use print table to display information cleanly
        printTable(data);
        //return to main menu once done displaying the information for the user
        mainMenu();
    })
}
function viewRoles(){
    //display roles as specified in the queries file
    db.query(`SELECT role.id, title, salary, name as department FROM role LEFT JOIN department on department.id = role.department_id;`, (err, data)=>{
        printTable(data);
        mainMenu();
    })
}
function viewEmployees(){
    //display employees as specified in the queries file
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, title, name as department, salary, CONCAT(managers.first_name, ' ', managers.last_name) as manager FROM employee 
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on department.id = role.department_id
    LEFT JOIN employee as managers on employee.manager_id = managers.id;`, (err,data)=>{
        printTable(data);
        mainMenu();
    })
}
function addDepartment(){
    //get user input
    inquirer.prompt([
        {
            type:"input",
            message:"What is the name of the department?",
            name:"name"
        }
        //have a callback to populate the table with the user's response
    ]).then(answer=>{
        db.query(`INSERT INTO department (name) VALUES(?)`, [answer.name], err=>{
            console.log("Department added successfully!");
            viewDepartments();
        })
    })
}
function addRole(){
    //Use query to get data from the department table to use as options for the user to choose from 
    db.query(`SELECT id as value, name FROM department `, (err,departmentData)=>{
            inquirer.prompt([
                {
                    type:"input",
                    message:"What is the name of the role?",
                    name:"title"
                },
                {
                    type:"input",
                    message:"What is the salary of the role?",
                    name:"salary"
                },
                {
                    type:"list",
                    message:"Which department does the role belong to?",
                    name:"department_id",
                    //use dynamic data with departmentData gathered from query above
                    choices:departmentData
                }
            ]).then(answer=>{
                //Use query to add on to the role table with values from the user's input
                db.query(`INSERT INTO role (title, salary, department_id) VALUES(?,?,?)`, [answer.title, answer.salary, answer.department_id], err=>{
                    console.log("Role added successfully!");
                    viewRoles();
                })
            })
        })
}
function addEmployee(){
    //value and name act as keywords for the inquirer prompt
    db.query(`SELECT id as value, title as name FROM role `, (err,roleData)=>{
        db.query(`SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee`, (err, managerData)=>{
            inquirer.prompt([
                {
                    type:"input",
                    message:"What is the employee's first name?",
                    name:"first_name"
                },
                {
                    type:"input",
                    message:"What is the employee's last name?",
                    name:"last_name"
                },
                {
                    type:"list",
                    message:"What is the employee's role?",
                    name:"role_id",
                    //use dynamic data with roleData gathered from query above
                    choices:roleData
                },
                {
                    type:"list",
                    message:"Who is the employee's manager?",
                    name:"manager_id",
                    //use dynamic data with managerData gathered from query above
                    choices: managerData
                }
            ]).then(answer=>{
                //Use query to add on to the employee table with values from the user's input
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], err=>{
                    console.log("Employee added successfully!");
                    viewEmployees();
                })
            })
        })
    })
}
function updateEmployeeRole(){
    db.query(`SELECT id as value, title as name FROM role `, (err,roleData)=>{
        db.query(`SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee`, (err, employeeData)=>{
            inquirer.prompt([
                {
                    type:"list",
                    message:"Which employee would you like to update?",
                    name:"employee_id",
                    //use dynamic data with managerData gathered from query above
                    choices: employeeData
                },
                {
                    type:"list",
                    message:"What is the employee's role?",
                    name:"role_id",
                    //use dynamic data with roleData gathered from query above
                    choices:roleData
                }
            ]).then(answer=>{
                //Use query to update the employee table with values from the user's input
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [answer.role_id, answer.employee_id], err=>{
                    console.log("Employee updated successfully!");
                    viewEmployees()
                })
            })
        })
    })
}