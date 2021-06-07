# Storefront Backend API - Udacity Fullstack JS Nanodegree #

## Introduction ##

This is a REST API simulating an e-commerce backend based on three models: Products, Orders and Users. A detailed list of the endpoints and actions available is available in the [REQUIREMENTS.md](https://github.com/fedeval/storefront-backend-api/blob/main/REQUIREMENTS.md) file.

---
## Setup ##

### Database config ###

The API connects to a postgres database. As a first step you should create two databases (development and test) on your local machine. Run the command `psql postgres` in terminal to open the postgres CLI. The run the following:

```SQL
CREATE USER storefront_user WITH PASSWORD 'YOUR_PASSWORD_HERE';
CREATE DATABASE storefront;
\c storefront;
GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;
CREATE DATABASE storefront_test;
\c storefront_test;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;
````

To make sure the API can connect to the db you it is necessary to create a `database.json` file with the following format

```json
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront",
    "user": "storefront_user",
    "password": 'YOUR_PASSWORD_HERE'
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront_test",
    "user": "storefront_user",
    "password": 'YOUR_PASSWORD_HERE'
  }
}
```

Note: it is best to add this file to a `.gitignore` file in order to keep the password hidden.


### Environment variables ###

The API relies on several environment variables to function. `dotenv` is already included in the `package.json`file, so it is only necessary to create a `.env` file with the following variables:

| Name              | Value            | Notes         |
| ------------------|:----------------:|:-------------:|
| POSTGRES_HOST     | 127.0.0.1        | Same value as in the database.json file |
| POSTGRES_DB       | storefront       | Same value as in the database.json file |   
| POSTGRES_TEST_DB  | storefront_test  | Same value as in the database.json file |
| POSTGRES_USER     | storefront_user  | Same value as in the database.json file |
| POSTGRES_PASSWORD | YOUR_PASSWORD    | Same value as in the database.json file |
| ENV               | dev              | Used to set the DB environment. The test scripts automatically changes it to test when runnning, using the crosss-env package.|
| PORT              | 3000             | The API will run on http://localhost.${PORT} |
| SALT_ROUNDS       | 10               | Number of salt rounds the password hashing function of the bcrypt package will be using|
| PEPPER            | YOUR_STRING_HERE | A string of your choise that bcrypt will be adding when prior to hashing passwords for an extra layer of security |
| TOKEN_SECRET      | YOUR_STRING_HERE | A string that will be used by jwt to generate authentication tokens. The more complex the better, it should be random carachters ideally. |

**IMPORTANT: .env should be added to .gitignore and never committed to a public repo.**


---
## Getting Started ##

### Installing dependencies ###

After cloning the repo, all the project dependencies can be installed using npm:
```
npm install
```

### Running the server ###

To execute the application use the following command in terminal:

```
npm run start
```

the app will then be available on port 3000 by default, but that can be changed by editing the PORT environment variable (more details on environment variables in the next section.

### Scripts ###

The following actions can be executed through npm scripts:

#### Transpiling typescript to javascript ####

```
npm run build
```

The transpiled code will be available in the `build` folder.

#### Testing ####

A set of jasmine testing suites can be used to test both the endpoints as well as the models. 

```
npm run test
```
NOTE: this script runs migrations on a test database.


#### Formatting ####

The code can be automatically formatted using prettier. The formatting options can be customised by editin the `.prettierrc`file.

```
npm run prettier
```

#### Linting ####

The code can ba automatically linted using ESlint. Note that ESlint will also use prettier to test for incorrect formatting. Rules, plugins and extensions for ESlint can be modified through the `.eslintrc` file.

```
npm run lint
```
---
## How to use ##

The API offers one endpoint to access and resize images available in the `public/images/full` folder.

The endpoint is `api/images` and requires three query params:

| Query Param   | Value         |
| ------------- |:-------------:|
| filename      | the filename (without extension) of one of the images available in the folder |
| height        | it should be a positive integer      |
| width         | it should be a positive integer      |

Note that full instructions including a preview of all the available images and their filenames can be accessed using the main API endpoint. Assuming the app is running on port 3000 that would be:

[http://localhost:3000/api](http://localhost:3000/api)

An example of a correct endpoint call would be: 

[http://localhost:3000/api/images?filename=palmtunnel&height=250&width=220](http://localhost:3000/api/images?filename=palmtunnel&height=250&width=220)
