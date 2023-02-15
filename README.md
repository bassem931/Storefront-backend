# Storefront Backend Project <!-- omit in toc -->

this is a Store backend api project which is part of the FWD Udacity advanced Web development course. It can be used to create a store with user creation and signing in,create an order and add items to cart

## Table of contents <!-- omit in toc -->

- [Project Setup](#project-setup)
  - [Environment variables](#environment-variables)
  - [Package installations](#package-installations)
  - [Database](#database)
    - [Set up database](#set-up-database)
      - [Database Creation](#database-creation)
      - [User Creation](#user-creation)
    - [Data Shapes](#data-shapes)
      - [Product](#product)
      - [User](#user)
      - [Orders](#orders)
      - [Order_products](#order_products)
  - [How to use](#how-to-use)
  - [Using postman](#using-postman)
- [Technical information](#technical-information)
  - [Required Technologies](#required-technologies)
  - [API Endpoints](#api-endpoints)
    - [Products](#products)
    - [Users](#users)
    - [Orders](#orders-1)
    - [Order_products](#order_products-1)
    - [Service handler](#service-handler)
  - [Database configuration in backend](#database-configuration-in-backend)
  - [Models](#models)
  - [Services](#services)
  - [Handlers](#handlers)
  - [Authentication middleware and JWTs](#authentication-middleware-and-jwts)
  - [Bcrypt library](#bcrypt-library)
  - [Tests](#tests)

## Project Setup

### Environment variables

To set up the project A .env file must be created and added. This is made to ensure that your sensitive project information is hidden.
These are the environment variables to be defined:

- port (number) = the port for the server to listen on if not defined 3000 will be used as a default option
- postgres_host = the host to run the database on . during development localhost is used
- port for database to run on = to configure the postgres database port.
  Default is 5423 if another port used it will cause an error .To change port change postgres port on your system from postgres.conf

- postgres_db = the name of the database
- postgres_db_test = the name of the testing database
- postgres_user = the name of the postgres user which will be used to access and edit the database
- postgres_pass = the password of the postgres user
- env = to change the database used it should be 'dev' for development
- passBcrypt = the password or pepper used that is added with any password hashed
- saltRounds (number )= the number of hashing rounds or salt
- tokenPass = the password used to verify tokens

### Package installations

All the dependencies required is defined in the package.json file. To install use 'npm install' or 'yarn install' if you have yarn installed globally

### Database

#### Set up database

**To set up the database follow the steps below**

- connect to postgres user or any other superuser using (psql -U postgres)
- enter user password

  ##### Database Creation

- create 2 databases for the store one for test and one for dev. in the future another one can be created for production
  use these sql queries:
- CREATE DATABASE store_db;
- CREATE DATABASE store_db_test;
  ##### User Creation
- create user using sql query (CREATE USER store_user WITH PASSWORD pass123;)
- grant privileges for user to be able to access database
  use these sql queries:
- GRANT ALL PRIVILEGES ON DATABASE store_db TO store_user;
- GRANT ALL PRIVILEGES ON DATABASE store_db_test TO store_user;

After these steps the databases are created and a user with access to the database is created. The next step is to run the migrations using the script yarn migrate-up to create the tables. yarn migrate-down will drop all tables

#### Data Shapes

In this section the database tables will be explained along with the relations between the tables. each subsection represents a table. The table columns will be stated along with a sql like query to explain the relations and column types. note that All the added lines after the table are not sql it is just to illustrate the data types and relations.

##### Product

- id
- name
- price
- [OPTIONAL] category

table: products

| id  | name | price | category |
| --- | ---- | ----- | -------- |
|     |      |       |          |
|     |      |       |          |

**products: (id SERIAL PRIMARY KEY, name VARCHAR , price NUMERIC , category VARCHAR)**

##### User

- id
- firstName
- lastName
- username
- password

table: users

| id  | first_name | last_name | username | password |
| --- | ---------- | --------- | -------- | -------- |
|     |            |           |          |          |
|     |            |           |          |          |

**users: (ID SERIAL PRIMARY KEY, first_name VARCHAR , last_name VARCHAR , username VARCHAR , password VARCHAR)**

##### Orders

- id
- user_id
- status of order (active or complete)

table: orders

| id  | user_id | order_status |
| --- | ------- | ------------ |
|     |         |              |
|     |         |              |

- user_id FOREIGN KEY of users.id

**_orders: (id SERIAL PRIMARY KEY,user_id INTEGER FOREIGN KEY OF users (id), order_status order_status_type)_**

order_status_type is an ENUM of values 'active' or 'completed'

##### Order_products

- id
- user_id
- product_id
- quantity of each product in the order

table: orders_products

| id  | order_id | product_id | quantity |
| --- | -------- | ---------- | -------- |
|     |          |            |          |
|     |          |            |          |

- order_id FOREIGN KEY of users.id
- product_id FOREIGN KEY of products.id

**order_products(id SERIAL PRIMARY KEY , order_id INTEGER FOREIGN KEY OF users.id , product_id INTEGER FOREIGN KEY OF products.id , quantity INTEGER)**

### How to use

after creating .env file , setting up database and installing package, run yarn start to run the start script. after that using a program like [postman](https://www.postman.com/downloads/) which is an API testing program. it can be used to test each endpoint.

### Using postman

To use postman properly to test the API. the right information needed in each endpoint must be supplied. For example each create or post endpoint must have a request body with the parameters needed to create the item so they must be supplied through postman. Other parameters like JWT have to be supplied in endpoints with token required. All endpoints with needed tokens are specified in API endpoints section. getting the JWT will be explained in the JWT section

## Technical information

### Required Technologies

Your application use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

### API Endpoints

The API endpoints are divided in multiple handler files all of the same name as the subsection name. each enpoint is provided along with its type

#### Products

- Index : **_`/products`_** [GET]
- Show : **_`/products/:productId`_** [GET]
- Create [token required] : **_`/products`_** [POST]

- Top 5 most popular : **_`/Top5`_** [GET]
- Products by category (args: product category) : **_`/products/category/:category`_** [GET]

- update [token required] : **_`/products/:productId`_** [PATCH]
- delete [token required] : **_`/products/:productId`_** [DELETE]

#### Users

- Index [token required] : **_`/users`_** [GET]
- Show [token required] : **_`/users/:userid`_** [GET]

- Create [token required] : **_`/users`_** [GET]
- update [token required] : **_`/users/:id`_** [PATCH]
- delete [token required] : **_`/users/:id`_** [PATCH]

- sign in [token required] : **_`/signin`_** [GET]

- authenticate [token required] : **_`/users/:id/auth`_** [POST]

#### Orders

- Index [token required] : **_`/orders`_** [GET]
- Show [token required] : **_`/users/:userid/orders/:id`_** [GET]

- Create [token required] : **_`/users/:userId/order/`_** [GET]

- update [token required] : **_`/users/:userId/order/:orderId`_** [PATCH]
- delete [token required] : **_`/users/:userId/order/:orderId`_** [PATCH]

#### Order_products

- Index [token required] : **_`/myOrder/products`_** [GET]
- getOrderProducts [token required] : **_`/myOrder/products/:orderid`_** [GET]

- addProduct [token required] : **_`/users/:userId/addtocart`_** [POST]
- updateProduct [token required] : **_`/users/:userId/editcart`_** [PATCH]
- deleteProduct [token required] : **_`/users/:userId/deletecart`_** [DELETE]

#### Service handler

These endpoints are done using join to show products and are available in the service handler

- Current Order by user (args: user id)[token required] : **_`/orders`_** [GET]
- Completed Orders by user (args: user id)[token required] : **_`/orders/comp`_** [GET]

### Database configuration in backend

To configure the database in the backend part. db migrate and pg was used. db-migrate was used to handle the migrations and pg was used to handle connecting to the database. pg was configured in the database.ts file in config folder. It uses the postgres host,postgres username, postgres password and postgres port.db migrate was used by creating 4 different migrations one for each table. the migrations were created using the sql files configuration which can be done in db migrate. db migrate create two sql files for each migration the migration up file and the migration down file. the migration up and down were defined for each table. Then a migrate up was created to do it automatically and a migrate down as well.These scripts was used during development and they are used during testing

### Models

A model file were created for each table in the database. The model functionality is to connect the database to the server. In each model file a class is created with functions for each CRUD operation. The model connects to the database using the pg client created in the config file. Then it sends the required sql query to the database and retrieves the information and return it to be used later. These are the models implemented in the models folder

- orders_products model
- orders model
- products model
- Users model

### Services

Services are very similar to the model files as they provide the same functionality but with a small difference. models are files responsible for a table crud operations but services are used for sql queries using the SQL JOIN which combines information of several tables into one table. services were placed in a different category from models as these queries does not represent one table so to avoid confusion they were placed in a several folder .The two services were:

- product Services
- order Services

product service has one function that return the five most popular products based on number of times it is ordered

order services has two functions that get active orders and another one to get complete orders

### Handlers

Handlers are the files responsible for routing the endpoints of the application. This is done by calling the model functions and sending the data needed for the model function. Then it receives the response and return it to the user. One of the most important jobs is to check that the input from the request is valid to be sent to the model. This is to prevent any database errors as the model expects each input in a certain type or form. For example all numbers must be checked that it is a positive number. Strings are also checked and all inputs are checked for being defined. In case of update operation more logic is required. The way it is implemented here is to give the most flexibility for the user. If the user wants to update any parameter this parameter can only be sent without any more parameters and it will be updated. This was done by checking for the parameters in the request and sending the info to the model that alters the sql query using some if functions to update the required items. Many of the handlers required tokens to work properly but this part is handled in the middleware file authuser.ts

### Authentication middleware and JWTs

The middleware folder contains one file which is responsible for the user authentication part. This was created as a middleware so it can be checked before accessing any of the handler and model files. the authentication implemented in this project is defined to several types .First you must be a user to create an order.Second,to create an order you must be a user and your order id must be matched so that orders will not be accessible to anyone

endpoints that return tokens:

- **_`/users`_** [POST]: return a token with user id
- **_`/users/:userId/order/`_** [POST] : return a token with user_id,order_id and order status of active
- **_`users/:userId/order/:orderId`_** [POST] : return a token with user_id,order_id and the updated order status

The authentication was created this way to prevent any user from accessing any information not his own so a user can only edit his account and his orders to ensure
each user data is protected from being overwritten or edited.

The implemented system gives the user a token when creating a user creates a JWT with the user id. These token can be used to update user , get user information or delete user.

When the user creates an order. The token present is replaced by another token that adds the user id , the order id and the order status in the JWT. This ensures that the user can only perform operations on the order id present in the token. This allows the user to get order info, update order status and delete order. In case of adding and removing products ,the same authentication is used but a check is made to ensure order in token is active and not a completed order.All this ensures that only the authorized actions can be made

### Bcrypt library

Bcrypt library was used for password hashing to make the user passwords hard to get. The idea of hashing ensures that the users sensitive data is stored in a safe way in the database so that even in case of a breach to the database, The users passwords will be safe.

### Tests

Tests was created for each step. For each model and service, a spec file was created to test the functionality of each function. These can be considered unit tests. At least each function were tested once and functions like the update were tested several times using different input combinations. Some functions were tested with wrong input to test the error handling. Error handling in this project was implemented to handle many different cases and to give descriptive feedback in case of errors.

As for handlers , each handler file had a handler spec file used for testing. These tests can be considered endpoint tests as the handler use the model functions and that is why the model functions were tested before the handlers. Handlers were tested with each endpoint being tested at least once. endpoint were tested also using postman and were checked for edge cases
