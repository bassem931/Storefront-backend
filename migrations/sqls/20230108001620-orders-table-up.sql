/* Replace with your SQL commands */
CREATE TYPE order_status_type AS ENUM ('active', 'completed');
CREATE TABLE orders(id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users (id), order_status order_status_type  NOT NULL);