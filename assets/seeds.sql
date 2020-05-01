INSERT INTO department (dep_name)
VALUES ("Engineering"), ("Marketing"), ("Accounting"), ("Human Resources"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Developer", 60000, 1), ("Marketing Coordinator", 55000, 2), ("Accountant", 60000, 3), ("Recruiter", 55000, 4), ("Salesperson", 50000, 5), ("Creative Team Manager", 65000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 2, 2), ("Bruce", "Lee", 6, null), ("Ryan", "Seacrest", 1, null), ("Brad", "Pitt", 4, null), ("Lebron", "James", 1, 2), ("Guy", "Fieri", 5, null), ("Albert", "Einstein", 3, null);

INSERT INTO manager (name, employee_id)
VALUES ("Bruce Lee", 2);