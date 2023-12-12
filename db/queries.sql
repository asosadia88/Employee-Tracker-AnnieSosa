USE employee_db;

-- display all departments
SELECT * FROM department;

-- display all roles
SELECT role.id, title, salary, name as department FROM role LEFT JOIN department on department.id = role.department_id;

-- display all employees
SELECT employee.id, employee.first_name, employee.last_name, title, name as department, salary, CONCAT(managers.first_name, ' ', managers.last_name) as manager FROM employee 
LEFT JOIN role on employee.role_id = role.id
LEFT JOIN department on department.id = role.department_id
LEFT JOIN employee as managers on employee.manager_id = managers.id;

-- add a department to the database
