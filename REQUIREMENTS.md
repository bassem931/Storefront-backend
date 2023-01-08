# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index : '/products' [GET]
- Show : '/products/:id' [GET]
- Create [token required] : '/products' [POST]

- [OPTIONAL] Top 5 most popular : 'products/Top5' [GET]
- [OPTIONAL] Products by category (args: product category) : '/products/category' [GET]

- [OPTIONAL] [ADDED] update [token required] : '/products/:id' [PATCH]
- [OPTIONAL] [ADDED] delete [token required] : '/products/:id' [DELETE]

#### Users

- Index [token required] : '/users' [GET]
- Show [token required] : '/users/:id' [GET]

- Create N[token required] : '/users' [GET]
- [OPTIONAL] [ADDED] update [token required] : '/users/:id' [PATCH]
- [OPTIONAL] [ADDED] delete [token required] : '/users/:id' [PATCH]

- [OPTIONAL] [ADDED] authenticate [token required] : '/users/:id/auth' [POST]

#### Orders

- Current Order by user (args: user id)[token required] : '/orders' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] : '/orders/comp' [GET]

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

| id  | user_id | order_Status |
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

| id  | user_id | product_id | quantity |
| --- | ------- | ---------- | -------- |
|     |         |            |          |
|     |         |            |          |
|     |         |            |          |

- user_id FOREIGN KEY of users.id
- product_id FOREIGN KEY of products.id

**order_products(id SERIAL PRIMARY KEY , user_id INTEGER FOREIGN KEY OF users.id , product_id INTEGER FOREIGN KEY OF products.id , quantity INTEGER)**

##### NOTE

All the added lines is not sql it is just to illustrate the data types and relations.
