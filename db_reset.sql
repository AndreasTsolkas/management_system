-- DROP SCHEMA management_system;

CREATE SCHEMA management_system AUTHORIZATION postgres;

-- DROP SEQUENCE management_system.bonus_id_seq;

CREATE SEQUENCE management_system.bonus_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE management_system.bonus_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE management_system.bonus_id_seq TO postgres;

-- DROP SEQUENCE management_system.department_id_seq;

CREATE SEQUENCE management_system.department_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE management_system.department_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE management_system.department_id_seq TO postgres;

-- DROP SEQUENCE management_system.employee_id_seq;

CREATE SEQUENCE management_system.employee_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE management_system.employee_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE management_system.employee_id_seq TO postgres;







-- DROP SEQUENCE management_system.vacation_request_id_seq;

CREATE SEQUENCE management_system.vacation_request_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE management_system.vacation_request_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE management_system.vacation_request_id_seq TO postgres;
-- management_system.department definition

-- Drop table

-- DROP TABLE management_system.department;

CREATE TABLE management_system.department (
	id serial4 NOT NULL,
	"name" varchar NULL,
	CONSTRAINT company_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE management_system.department OWNER TO postgres;
GRANT ALL ON TABLE management_system.department TO postgres;


-- management_system.project definition




-- management_system.employee definition

-- Drop table

-- DROP TABLE management_system.employee;

CREATE TABLE management_system.employee (
	id serial4 NOT NULL,
	employee_uid int4 NULL,
	vacation_days int4 NULL,
	department_id int4 NULL,
	start_date timestamp NULL,
	salary float8 NULL,
	"name" varchar(255) NULL,
	surname varchar(255) NULL,
	email varchar(255) NULL,
	employment_type varchar(255) NULL,
	is_accepted bool NULL,
	is_admin bool NULL,
	"password" varchar(60) NULL,
	CONSTRAINT employee_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_d62835db8c0aec1d18a5a927549" FOREIGN KEY (department_id) REFERENCES management_system.department(id)
);

-- Permissions

ALTER TABLE management_system.employee OWNER TO postgres;
GRANT ALL ON TABLE management_system.employee TO postgres;






-- management_system.vacation_request definition

-- Drop table

-- DROP TABLE management_system.vacation_request;

CREATE TABLE management_system.vacation_request (
	id serial4 NOT NULL,
	employee_id int4 ,
	start_date date NOT NULL,
	end_date date NOT NULL,
	status varchar(20) NOT NULL,
	days int4 NOT NULL,
	CONSTRAINT vacation_request_pkey PRIMARY KEY (id),
	CONSTRAINT vacation_request_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES management_system.employee(id)
);

-- Permissions

ALTER TABLE management_system.vacation_request OWNER TO postgres;
GRANT ALL ON TABLE management_system.vacation_request TO postgres;


-- management_system.bonus definition

-- Drop table

-- DROP TABLE management_system.bonus;

CREATE TABLE management_system.bonus (
	id serial4 NOT NULL,
	employee_id int4 ,
	amount numeric(10, 2) NOT NULL,
	date_given timestamp NOT NULL,
	CONSTRAINT bonus_pk PRIMARY KEY (id),
	CONSTRAINT bonus_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES management_system.employee(id)
);

-- Permissions

ALTER TABLE management_system.bonus OWNER TO postgres;
GRANT ALL ON TABLE management_system.bonus TO postgres;




-- Permissions

GRANT ALL ON SCHEMA management_system TO postgres;

--- Insert into Department table

INSERT INTO management_system.department ("name") VALUES
	 ('Engineering'),
	 ('Marketing'),
	 ('Business Analysis'),
	 ('Logistics'),
	 ('Sales'),
	 ('Management'),
	 ('Product Development');



--- Insert into Employee table

INSERT INTO management_system.employee (employee_uid,vacation_days,department_id,start_date,salary,"name",surname,email,employment_type,is_accepted,is_admin,"password") VALUES
	 (12376,10,3,'2020-06-22 19:10:25',1500.0,'Andrew','Stevenson','astevenson@gmail.com','business analyst',true,false,'thispassword'),
	 (13812,10,1,'2021-10-17 13:10:20',1700.0,'Mathew','James','mjames@gmail.com','system administartor',true,false,'thidpassword'),
	 (14198,17,2,'2022-06-07 13:13:20',1300.0,'Deppy','Jackson','djackson@gmail.com','market researcher',true,false,'thispassword'),
	 (13425,20,1,'2021-06-23 19:10:25',1400.0,'Jane','Larce','jlarce@gmail.com','software developer',true,false,'thispassword');


--- Insert into Bonus table

INSERT INTO management_system.bonus (employee_id,amount,date_given) VALUES
	 (3,240.00,'2020-01-22 00:00:00'),
	 (1,300.00,'2019-03-22 00:00:00'),
	 (2,320.00,'2019-04-22 00:00:00'),
	 (2,160.00,'2020-06-22 00:00:00'),
	 (2,150.00,'2020-12-22 00:00:00'),
	 (1,300.00,'2021-01-22 00:00:00'),
	 (2,1000.00,'2021-01-27 00:00:00'),
	 (2,3500.00,'2021-02-22 00:00:00'),
	 (2,3500.00,'2021-09-15 00:00:00'),
	 (2,1000.00,'2022-01-22 00:00:00');
INSERT INTO management_system.bonus (employee_id,amount,date_given) VALUES
	 (2,1400.00,'2022-01-27 00:00:00'),
	 (2,400.00,'2022-06-22 00:00:00'),
	 (2,1200.00,'2022-10-22 00:00:00'),
	 (2,400.00,'2022-10-29 00:00:00'),
	 (2,400.00,'2023-10-10 19:51:15.748');


--- Insert into Vacation request table

INSERT INTO management_system.vacation_request (employee_id,start_date,end_date,status,days) VALUES
	 (4,'2020-06-22','2020-07-22','accepted',30),
	 (1,'2020-07-22','2020-08-22','rejected',30),
	 (2,'2020-07-22','2020-08-22','accepted',30),
	 (3,'2020-06-22','2020-06-22','pending',30),
	 (1,'2020-06-22','2020-06-22','pending',30),
	 (2,'2020-01-01','2020-01-10','pending',7),
	 (2,'2020-01-01','2020-01-17','pending',13


