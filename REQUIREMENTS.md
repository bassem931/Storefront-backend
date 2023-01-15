# Store backend api

this is a Store backend api project which is part of the FWD Udacity advanced Web development course.
It can be used to create a store with user creation and signing in.

## API Endpoints

#### Products

- [x] Index : '/products' [GET]
- [x] Show : '/products/:id' [GET]
- [x] Create [token required] : '/products' [POST]

- [x] [OPTIONAL] Top 5 most popular : 'products/Top5' [GET]
- [x] [OPTIONAL] Products by category (args: product category) : '/products/category:category' [GET]

- [x] [OPTIONAL] [ADDED] update [token required] : '/products/:id' [PATCH]
- [x] [OPTIONAL] [ADDED] delete [token required] : '/products/:id' [DELETE]

#### Users

- [x] Index [token required] : '/users' [GET]
- [x] Show [token required] : '/users/:userid' [GET]

- [x] Create N[token required] : '/users' [GET]
- [x] [OPTIONAL] [ADDED] update [token required] : '/users/:id' [PATCH]
- [x] [OPTIONAL] [ADDED] delete [token required] : '/users/:id' [PATCH]

- [OPTIONAL] [ADDED] authenticate [token required] : '/users/:id/auth' [POST]

#### Orders

- [x] Index [token required] : '/orders' [GET]
- [x] Show [token required] : '/users/:userid/orders/:id' [GET]

- [x] Create N[token required] : '/orders/:userid' [GET]

- [x] [OPTIONAL] [ADDED] update [token required] : '/orders/:id' [PATCH]
- [x] [OPTIONAL] [ADDED] delete [token required] : '/orders/:id' [PATCH]

//should be done using join to show products

- [x] Current Order by user (args: user id)[token required] : '/orders' [GET]
- [x] [OPTIONAL] Completed Orders by user (args: user id)[token required] : '/orders/comp' [GET]

#### Order_products

- [x] Index [token required] : '/orders' [GET]
- [x] getOrderProducts [token required] : '/myOrder/products/:orderid' [GET]

- [x] addProduct [token required] : '/myOrder/products/:orderid' [POST]
- [x] updateProduct [token required] : '/myOrder/products/:orderid' [PATCH]
- [x] deleteProduct [token required] : '/myOrder/products/:orderid' [DELETE]

##### NOTE

All endpoints are better explained and organized in a open-api.yaml file

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

table: products

| id  | name | price | category |
| --- | ---- | ----- | -------- |
|     |      |       |          |
|     |      |       |          |
|     |      |       |          |

**products: (id SERIAL PRIMARY KEY, name VARCHAR , price NUMERIC , category VARCHAR)**

#### User

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
|     |            |           |          |          |

**users: (ID SERIAL PRIMARY KEY, first_name VARCHAR , last_name VARCHAR , username VARCHAR , password VARCHAR)**

#### Orders

- id
- user_id
- status of order (active or complete)

table: orders

| id  | user_id | order_status |
| --- | ------- | ------------ |
|     |         |              |
|     |         |              |
|     |         |              |

- user_id FOREIGN KEY of users.id

**_orders: (id SERIAL PRIMARY KEY,user_id INTEGER FOREIGN KEY OF users (id), order_status order_status_type)_**

order_status_type is an ENUM of values 'active' or 'completed'

#### Order_products

- id
- user_id
- product_id
- quantity of each product in the order

table: orders_products

| id  | order_id | product_id | quantity |
| --- | -------- | ---------- | -------- |
|     |          |            |          |
|     |          |            |          |
|     |          |            |          |

- order_id FOREIGN KEY of users.id
- product_id FOREIGN KEY of products.id

**order_products(id SERIAL PRIMARY KEY , order_id INTEGER FOREIGN KEY OF users.id , product_id INTEGER FOREIGN KEY OF products.id , quantity INTEGER)**

##### NOTE

All the added lines are not sql it is just to illustrate the data types and relations.
