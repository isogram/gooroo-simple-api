# Gooroo Simple API
The SWAG committee is looking for a way to track who has which book from our library.  
The goal of this test is to create a simple RESTful server. You may use any 3rd party libraries and tools that you’d like. 

This Node.js CRUD code use 
- Express.js framework
- Sequelize ORM

## Installation

```
$ npm install
$ npx sequelize-cli db:migrate
$ npx sequelize-cli db:seed:all
$ node app.js # to run the application
```

## Database

The application connect to MySQL database using Sequelize. The configuration of database added in `models/index.js`. Configuration located at config directory.
Initialize the configuration and connect to database on `app.js`.
```
var models = require("./models");

models.sequelize.sync().then(function() {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});
```

This app use database named `gooroo`. So make sure you are create it before running the app.

## Route
Create `routes` folder on the root path and put route file there. After that initialiaze and register route file path on `app.js` file.

```
var books = require('./routes/books');

app.use('/books', books);
...
...
etc
```

## Documentation
This API documented with Postman. Files are included in the root of the project.  
Don't forget to import Postman collection and environment.  
At environment please define your own `URL` :)  
OR  
Online documentation here https://documenter.getpostman.com/view/100672/SzS7QRa8?version=latest 

Tips:  
- Expand collapsed title in Postman if you want to read detail description