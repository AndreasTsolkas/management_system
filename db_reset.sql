

CREATE SCHEMA management_system AUTHORIZATION postgres;



CREATE TABLE management_system.department (
	id serial4 NOT NULL,
	"name" varchar NULL,
	CONSTRAINT company_pkey PRIMARY KEY (id)
);



CREATE TABLE management_system.employee (
	id serial4 NOT NULL,
        employee_uid int4 NULL,
	vacation_days int4 NULL,
	department_id int4 NULL,
	start_date timestamp NULL,
	salary int4 NULL,
	"name" varchar(255) NULL,
	surname varchar(255) NULL,
	email varchar(255) NULL,
	employment_type varchar(255) NULL,
	CONSTRAINT employee_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_d62835db8c0aec1d18a5a927549" FOREIGN KEY (department_id) REFERENCES management_system.department(id)
);



CREATE TABLE management_system.project (
	id serial4 NOT NULL,
	"employeeId" int4 NULL,
	"name" varchar NULL,
	description varchar NULL,
	department_id int4 NULL,
	date_started date NULL,
	date_to_finish date NULL,
	CONSTRAINT project_pk PRIMARY KEY (id),
	CONSTRAINT project_fk FOREIGN KEY ("employeeId") REFERENCES management_system.employee(id),
	CONSTRAINT project_fk2 FOREIGN KEY (department_id) REFERENCES management_system.department(id)
);



CREATE TABLE management_system."user" (
	id serial4 NOT NULL,
	userid int4 NULL,
	password varchar(20) NOT NULL,
	is_admin bool NULL,
	is_accepted bool NULL,
	CONSTRAINT user_pk PRIMARY KEY (id),
	CONSTRAINT user_fk FOREIGN KEY (userid) REFERENCES management_system.employee(id)
);



CREATE TABLE management_system.vacation_request (
	id serial4 NOT NULL,
	employee_id int4 NOT NULL,
	start_date date NOT NULL,
	end_date date NOT NULL,
	status varchar(20) NOT NULL,
	days int4 NOT NULL,
	CONSTRAINT vacation_request_pkey PRIMARY KEY (id),
	CONSTRAINT vacation_request_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES management_system.employee(id)
);



CREATE TABLE management_system.bonus (
	id serial4 NOT NULL,
	employee_id int4 NOT NULL,
	department_id int4 NOT NULL,
	amount numeric(10, 2) NOT NULL,
	CONSTRAINT bonus_pk PRIMARY KEY (id),
	CONSTRAINT bonus_department_id_fkey FOREIGN KEY (department_id) REFERENCES management_system.department(id),
	CONSTRAINT bonus_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES management_system.employee(id)
);
