# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index : `'/products' [GET]`
- Show : `'/products/:id' [GET]`
- Create [token required] : `'/products' [POST]`
- Delete [token required] : `'/products/:id' [DELETE]`

#### Users
- Index [token required] : `'/users' [GET]`
- Show [token required] : `'/users/:id' [GET]`
- Create [token required] : `'/users' [POST]`
- Authenticate (args: username, password) [token required] : `'/auth' [GET]`
- AddProductToOrder (args: orderId, productId, quantity) [token required]: `'/users/:id/add-product-to-order' [POST]`
- RemoveProductFromOrder (args: orderId, productId) [token required] `'/users/:id/remove-product-from-order' [DELETE]`

#### Orders
- Create (args: userId) [token required] : `'/orders' [POST]`
- UpdateStatus (args: userId) [token required]: `'/orders' [PUT]`
- Active Order by user (args: user id) [token required] : `'orders/users/:userId/active' [GET]`
- Completed Orders by user (args: user id) [token required] `'orders/users/:userId/completed' [GET]`

<!-- TBD
### Dashboard
- [OPTIONAL] Top 5 most popular products  : `/top-five-products' [GET]`
- [OPTIONAL] Products by category (args: product category) : `'/products-in-category'[GET]`
-->

## Data Shapes
#### Product
- id
- name
- price
- category
- rating

| Column        | Type               |
| ------------- |:------------------:|
| id            | SERIAL PRIMARY KEY |
| name          | VARCHAR            |
| price         | INTEGER            |
| category      | VARCHAR            |
| rating        | NUMERIC(3,2) MAX 5 |

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
- user_id
- status of order (active or complete)

| Column        | Type                        |
| ------------- |:---------------------------:|
| id            | SERIAL PRIMARY KEY          |
| userId        | FOREIGN KEY to USERS        |
| currentStatus | ENUM ('active','complete')  |

Since an order has many products and a product can be in many orders, we need a join
table to represent this N:N relationship.

##### Order_details
- id
- id of product
- quantity of product
- id of order to which the product has been added

| Column        | Type                       |
| ------------- |:--------------------------:|
| id            | SERIAL PRIMARY KEY         |
| productId     | FOREIGN KEY to PRODUCTS    |
| quantity      | INTEGER                    |
| orderId       | FOREIGN KEY to ORDERS      |

