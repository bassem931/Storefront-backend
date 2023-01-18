# Storefront Backend Project

## Project Setup

### Environment variables

to set up the project A .env file must be created and added. This is made to ensure that your sensitive project information is hidden.
These are the environment variables to be defined:
port (number) = the port for the server to listen on if not defined 3000 will be used as a default option
postgres_host = the host to run the database on . during development localhost is used
port for database to run on = to configure the postgres database port. default is 5423 if another port used it will cause an error.To change port change postgres port on your system from postgres.conf
postgres_db = the name of the database
postgres_db_test = the name of the testing database
postgres_user = the name of the postgres user which will be used to access and edit the database
postgres_pass = the password of the postgres user
env = to change the database used it should be 'dev' for development
passBcrypt = the password or pepper used that is added with any password hashed
saltRounds (number )= the number of hashing rounds or salt
tokenPass = the password used to verify tokens

### Package instructions

all the dependencies required is defined in the package.json file. To install use 'npm install' or 'yarn install' if you have yarn installed globally

### set up database

#### To set up the database follow the steps below

- connect to postgres user or any other superuser using (psql -U postgres)
  -enter user password
  **Database**
- create 2 databases for the store one for test and one for dev. in the future another one can be created for production
  use these sql queries:
- CREATE DATABASE store_db;
- CREATE DATABASE store_db_test;
  **User**
- create user using sql query (CREATE USER store_user WITH PASSWORD pass123;)
- grant privileges for user to be able to access database
  use these sql queries:
- GRANT ALL PRIVILEGES ON DATABASE store_db TO store_user;
- GRANT ALL PRIVILEGES ON DATABASE store_db_test TO store_user;

After these steps the databases are created and a user with access to the database is created. The next step is to run the migrations using the script yarn migrate-up to create the tables. yarn migrate-down will drop all tables

## Required Technologies

Your application must make use of the following libraries:

- [x] Postgres for the database
- [x] Node/Express for the application logic
- [x] dotenv from npm for managing environment variables
- [x] db-migrate from npm for migrations
- [x]jsonwebtoken from npm for working with JWTs
- [x]jasmine from npm for testing

## Steps to Completion

### 1. Plan to Meet Requirements

- [x] In this repo there is a `REQUIREMENTS.md` document which outlines what this API needs to supply for the frontend, as well as the agreed upon data shapes to be passed between front and backend. This is much like a document you might come across in real life when building or extending an API.

- [x] Your first task is to read the requirements and update the document with the following:

- [x] Determine the RESTful route for each endpoint listed. Add the RESTful route and HTTP verb to the document so that the frontend developer can begin to build their fetch requests.  
       **Example**: A SHOW route: 'blogs/:id' [GET]

- [x] Design the Postgres database tables based off the data shape requirements. Add to the requirements document the database tables and columns being sure to mark foreign keys.  
       **Example**: You can format this however you like but these types of information should be provided
      Table: Books (id:varchar, title:varchar, author:varchar, published_year:varchar, publisher_id:string[foreign key to publishers table], pages:number)

**NOTE** It is important to remember that there might not be a one to one ratio between data shapes and database tables. Data shapes only outline the structure of objects being passed between frontend and API, the database may need multiple tables to store a single shape.

### 2. DB Creation and Migrations

- [x] Now that you have the structure of the databse outlined, it is time to create the database and migrations. Add the npm packages dotenv and db-migrate that we used in the course and setup your Postgres database. If you get stuck, you can always revisit the database lesson for a reminder.

- [x] You must also ensure that any sensitive information is hashed with bcrypt. If any passwords are found in plain text in your application it will not pass.

### 3. Models

Create the models for each database table. The methods in each model should map to the endpoints in `REQUIREMENTS.md`. Remember that these models should all have test suites and mocks.

- [x] Users model
- [x] Users spec
- [x] products model
- [x] products spec
- [x] orders model
- [x] orders spec
- [x] orders_products model
- [x] orders_products spec

### 4. Express Handlers

Set up the Express handlers to route incoming requests to the correct model method. Make sure that the endpoints you create match up with the enpoints listed in `REQUIREMENTS.md`. Endpoints must have tests and be CORS enabled.

notes:

- [x] add products(if product exist add quantity)
- [x] remove products
- [x] update(quantity)
- [x] get

### 5. JWTs

the authentication implemented in this project is defined to several types first you must be a user to create an order.Second,to create an order you must be a user and your order id must be matched so that orders will not be accessible to anyone

endpoints that return tokens:

- '/users" [POST]: return a token with user id
- "/users/:userId/order/" [POST] : return a token with user_id,order_id and order status of active
- "/users/:userId/order/:orderId" [POST] : return a token with user_id,order_id and the updated order status

### 6. QA and `README.md`

Before submitting, make sure that your project is complete with a `README.md`. Your `README.md` must include instructions for setting up and running your project including how you setup, run, and connect to your database.

Before submitting your project, spin it up and test each endpoint. If each one responds with data that matches the data shapes from the `REQUIREMENTS.md`, it is ready for submission!

updated requirements and readme
read rubric
comment code
update yaml file
