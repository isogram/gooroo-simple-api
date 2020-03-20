## Task
The SWAG committee is looking for a way to track who has which book from our library.  
The goal of this test is to create a simple RESTful server. You may use any 3rd party libraries and tools that you’d like. 

## Requirements: 
1. The user can sign up by providing their email and a password. 
2. After that, sessions should be handled via tokenization. You should use the email address and password to exchange for an expirable token. These tokens are then used in subsequent requests to authenticate the user. The tones extend their life with every successful request a user makes.
3. The user can contribute books to the library. Each book should have a title, author, publisher, and categories. 
4. The user can check out others book from the library. You don’t need to think about return function at this moment. 
5. The user can see all books, each category of books.
6. The user can have a list of all books they contributed to the library. 
7. The user can edit their book, delete their book or clear all their books from the library. 
8. As we all know coding is not a solitary work (drinking is), you also required providing a well build API document. 
9. The backend required using Node.js.

## DB Design
- users
    - id:int
    - email:string
    - password:string

- books
    - id:int
    - title:string
    - author:string
    - publisher:string
    - user_id:int
    - is_deleted:bool

- book_categories
    - book_id:int
    - category_id:int

- categories
    - id:int
    - name:string

- checked_out_books
    - user_id:int
    - check_out_at:date
    - book_id:int

## List of possible Endpoints
POST - /users/register
POST - /users/login
GET  - /users/me
GET  - /users/contributions

GET  - /books?category_id=
GET  - /books/:id
POST - /books
PUT  - /books/:id
DELETE - /books/id
POST  - /books/:id/checkout

GET  - /categories

# Middleware
checkIDInput
checkIDExist
isAvailable
JWTCheck