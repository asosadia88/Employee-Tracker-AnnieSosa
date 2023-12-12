
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'asosadia88',
    password: 'password',
    database: 'test_db',
  });

const questions = [
    {
        type: 'list',
        name: 'options',
        message: 'Choose an option from the following list:',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role'
        ]
    }
];

function init() {
    inquirer
        .prompt(questions)
        .then((answers) => {
           if(answers.options === 'View all departments'){
            console.log('SELECT name, id AS department_id FROM department');
           }
           if(answers.options === 'View all roles'){
            console.log('SELECT title, id AS role_id, department_id, salary FROM role');
           }
           if(answers.options === 'View all employees'){
            console.log('SELECT first_name, last_name, role_id, manager_id FROM employee');
           }
           if(answers.options === 'Add a department'){
            inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: 'What is the name of the department you want to add?'
            }]).then((answer)=>{
                var query = 'INSERT INTO department (name) VALUES (\''+ answer.name +'\');';
                console.log(query);
            })
           }
           if(answers.options === 'Add a role'){
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the role you want to add?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for the role you want to add?'
                },
                {
                    type: 'input',
                    name: 'department',
                    message: 'What is the department ID for the role you want to add?'
                }
            ]).then((answer)=>{
                var query = 'INSERT INTO role (name, salary, department) VALUES (\''+ answer.name+'\', \''+ answer.salary +'\', \''+ answer.department+'\');';
                console.log(query);

            })
           }
           if(answers.options === 'Add an employee'){
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the first name of the employee you want to add?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the last name of the employee you want to add?'
                },
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the role of the employee you want to add?'
                },
                {
                    type: 'input',
                    name: 'manager_id',
                    message: 'What is the manager ID for the employee you want to add?'
                }
            ]).then((answer)=>{
                var query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('+ answer.first_name+', '+ answer.last_name +', '+ answer.role_id+', '+answer.manager_id+');';
                console.log(query);
            })
           }
           if(answers.options === 'Update an employee role'){
            // run query to select employee
            var employeeChoices = ['Ben', 'Yay', 'Whatever'];
            var roleChoices = ['Engineer', 'Concierge', 'Clown'];
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'What employee do you want to update the role for?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What role do you want to update to?',
                    choices: roleChoices
                }
            ]).then((answer)=>{
                var query = 'UPDATE employee SET role = ' + answer.role + ' WHERE id = '+answer.employee+';'
                console.log(query);
            })
           }
           return;

        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
                console.log('Prompt couldn\'t be rendered in the current environment')
            } else {
                console.log(error);
                throw error;
            }
        });
}

// Function call to initialize app
init();
