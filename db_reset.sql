-- TO RUN THIS SQL SCRIPT YOU NEED TO HAVE POSTGRESQL INSTALLED ON YOUR COMPUTER

-- Drop the management_system schema if it exists (uncomment to use)
-- DROP SCHEMA management_system CASCADE;

-- Create management_system schema
CREATE SCHEMA management_system AUTHORIZATION postgres;

-- Drop the sequences if they exist (uncomment to use)
-- DROP SEQUENCE management_system.bonus_id_seq;
-- DROP SEQUENCE management_system.department_id_seq;
-- DROP SEQUENCE management_system.employee_id_seq;
-- DROP SEQUENCE management_system.vacation_request_id_seq;

-- Create sequences for unique IDs
CREATE SEQUENCE management_system.bonus_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE management_system.department_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE management_system.employee_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

CREATE SEQUENCE management_system.vacation_request_id_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    NO CYCLE;

-- Set permissions on sequences
ALTER SEQUENCE management_system.bonus_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE management_system.bonus_id_seq TO postgres;

ALTER SEQUENCE management_system.department_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE management_system.department_id_seq TO postgres;

ALTER SEQUENCE management_system.employee_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE management_system.employee_id_seq TO postgres;

ALTER SEQUENCE management_system.vacation_request_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE management_system.vacation_request_id_seq TO postgres;

-- Create department table
-- Drop table if it exists (uncomment to use)
-- DROP TABLE management_system.department;

CREATE TABLE management_system.department (
    id serial PRIMARY KEY,  -- Use serial type for auto-increment
    "name" varchar(255) NOT NULL  -- Specify NOT NULL for required fields
);

-- Set permissions on department table
ALTER TABLE management_system.department OWNER TO postgres;
GRANT ALL ON TABLE management_system.department TO postgres;

-- Create employee table
-- Drop table if it exists (uncomment to use)
-- DROP TABLE management_system.employee;

CREATE TABLE management_system.employee (
    id serial PRIMARY KEY,
    employee_uid int,
    vacation_days int,
    department_id int,
    start_date timestamp,
    salary float8,
    "name" varchar(255),
    surname varchar(255),
    email varchar(255),
    employment_type varchar(255),
    is_accepted boolean,
    is_admin boolean,
    "password" varchar(60),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES management_system.department(id)
);

-- Set permissions on employee table
ALTER TABLE management_system.employee OWNER TO postgres;
GRANT ALL ON TABLE management_system.employee TO postgres;

-- Create vacation_request table
-- Drop table if it exists (uncomment to use)
-- DROP TABLE management_system.vacation_request;

CREATE TABLE management_system.vacation_request (
    id serial PRIMARY KEY,
    employee_id int,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status varchar(20) NOT NULL,
    days int NOT NULL,
    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES management_system.employee(id)
);

-- Set permissions on vacation_request table
ALTER TABLE management_system.vacation_request OWNER TO postgres;
GRANT ALL ON TABLE management_system.vacation_request TO postgres;

-- Create bonus table
-- Drop table if it exists (uncomment to use)
-- DROP TABLE management_system.bonus;

CREATE TABLE management_system.bonus (
    id serial PRIMARY KEY,
    employee_id int,
    amount numeric(10, 2) NOT NULL,
    date_given timestamp NOT NULL,
    CONSTRAINT fk_bonus_employee FOREIGN KEY (employee_id) REFERENCES management_system.employee(id)
);

-- Set permissions on bonus table
ALTER TABLE management_system.bonus OWNER TO postgres;
GRANT ALL ON TABLE management_system.bonus TO postgres;

-- Set permissions on the schema
GRANT ALL ON SCHEMA management_system TO postgres;

-- Insert into Department table
INSERT INTO management_system.department ("name") VALUES
    ('Engineering'),
    ('Marketing'),
    ('Business Analysis'),
    ('Logistics'),
    ('Sales'),
    ('Management'),
    ('Product Development');

-- Insert into Employee table
INSERT INTO management_system.employee (employee_uid, vacation_days, department_id, start_date, salary, "name", surname, email, employment_type, is_accepted, is_admin, "password") VALUES
    (12376, 10, 3, '2020-06-22 19:10:25', 1500.0, 'Andrew', 'Stevenson', 'astevenson@gmail.com', 'business analyst', true, false, '$2a$12$allti/8p14p/sM9TvHiDCOYLsh2gGhjIWqfzYHbyYehAkImp/9lRy'),
    (13812, 10, 1, '2021-10-17 13:10:20', 1700.0, 'Mathew', 'James', 'mjames@gmail.com', 'system administrator', true, false, '$2a$12$allti/8p14p/sM9TvHiDCOYLsh2gGhjIWqfzYHbyYehAkImp/9lRy'), -- Fixed typo: 'administartor' to 'administrator'
    (14198, 17, 2, '2022-06-07 13:13:20', 1300.0, 'Deppy', 'Jackson', 'djackson@gmail.com', 'market researcher', true, false, '$2a$12$allti/8p14p/sM9TvHiDCOYLsh2gGhjIWqfzYHbyYehAkImp/9lRy'),
    (13425, 20, 1, '2021-06-23 19:10:25', 1400.0, 'Jane', 'Larce', 'jlarce@gmail.com', 'software developer', true, false, '$2a$12$allti/8p14p/sM9TvHiDCOYLsh2gGhjIWqfzYHbyYehAkImp/9lRy');

-- Insert into Bonus table
INSERT INTO management_system.bonus (employee_id, amount, date_given) VALUES
    (3, 240.00, '2020-01-22 00:00:00'),
    (1, 300.00, '2019-03-22 00:00:00'),
    (2, 320.00, '2019-04-22 00:00:00'),
    (2, 160.00, '2020-06-22 00:00:00'),
    (2, 150.00, '2020-12-22 00:00:00'),
    (1, 300.00, '2021-01-22 00:00:00'),
    (2, 1000.00, '2021-01-27 00:00:00'),
    (2, 3500.00, '2021-02-22 00:00:00'),
    (2, 3500.00, '2021-09-15 00:00:00'),
    (2, 1000.00, '2022-01-22 00:00:00'),
    (2, 1400.00, '2022-01-27 00:00:00'),
    (2, 400.00, '2022-06-22 00:00:00'),
    (2, 1200.00, '2022-10-22 00:00:00'),
    (2, 400.00, '2022-10-29 00:00:00'),
    (2, 400.00, '2023-10-10 19:51:15.748');

-- Insert into Vacation request table
INSERT INTO management_system.vacation_request (employee_id, start_date, end_date, status, days) VALUES
    (4, '2020-06-22', '2020-07-22', 'accepted', 30),
    (1, '2020-07-22', '2020-08-22', 'rejected', 30),
    (2, '2020-07-22', '2020-08-22', 'accepted', 30),
    (3, '2020-06-22', '2020-06-22', 'pending', 30),
    (1, '2020-06-22', '2020-06-22', 'pending', 30),
    (2, '2020-01-01', '2020-01-10', 'pending', 7),
    (2, '2020-01-01', '2020-01-17', 'pending', 13);
