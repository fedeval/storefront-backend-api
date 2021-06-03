# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index : `'/products' [GET]`
- Show : `'/products/:id' [GET]`
- Create [token required] : `'/products' [POST]`
- [OPTIONAL] Top 5 most popular products  : `'/products/topfive' [GET]`
- [OPTIONAL] Products by category (args: product category) : `'/products?category=CATEGORY_NAME'[GET]`

#### Users
- Index [token required] : `'/users' [GET]`
- Show [token required] : `'/users/:id' [GET]`
- Create [token required] : `'/users' [POST]`

#### Orders
- Current Order by user (args: user id)[token required] : `'orders/users/:userId/current' [GET]`
- [OPTIONAL] Completed Orders by user (args: user id)[token required] `'orders/users/:userId/completed' [GET]`

## Data Shapes
#### Product
- id
- name
- price
- [OPTIONAL] category

| Column        | Type               |
| ------------- |:------------------:|
| id            | SERIAL PRIMARY KEY |
| name          | VARCHAR            |
| price         | INTEGER            |
| category      | VARCHAR            |

#### User
- id
- username
- firstName
- lastName
- password

| Column        | Type               |
| ------------- |:------------------:|
| id            | SERIAL PRIMARY KEY |
| username      | VARCHAR  UNIQUE    |
| firstName     | VARCHAR            |
| lastName      | VARCHAR            |
| password      | VARCHAR            |

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

|        ORDERS                               |
| ------------------------------------------- |
| Column        | Type                        |
| ------------- |:---------------------------:|
| id            | SERIAL PRIMARY KEY          |
| userId        | FOREIGN KEY to USERS        |
| status        | ENUM ('active','complete')  |

Since an order has many products and a product can be in many orders, we need a join
table to represent this N:N relationship.

|        ORDER_PRODUCTS                      |
| ------------------------------------------ |
| Column        | Type                       |
| ------------- |:--------------------------:|
| id            | SERIAL PRIMARY KEY         |
| productId     | FOREIGN KEY to PRODUCTS    |
| quantity      | INTEGER                    |
| orderId       | FOREIGN KEY to ORDERS      |

