# [Fitness-Overflow](https://fitnessoverflow.herokuapp.com/)

Fitness-Overflow is a clone off of [Stack Overflow](https://stackoverflow.com/). The theme of our website is about fitness and wellness interaction between the users.

## Feature List
### 1. New account creation, log in, log out, and guest/demo login
  * Users can sign up, log in, and log out.
  * Users can't use certain features without logging in.
  * Logged in users are directed to their profile page which displays all question and answers that are connected to user.
  * Logged out users are directed to a the home page with the most recently asked questions.
### 2. Ask Questions
  * user can ask questions
  * user can view asked questions
  * user edit owned questions
  * user can delete owned questions
### 3. Answer Questions
  * user can answer questions
  * user can view answers for specified question
  * user can edit owned answers
  * user can delete owned answers
### 4. Search for Questions
  * guests and users can use search bar to search for question using provided parameters
  * possibly limit displayed questions
  * filter by different methods
### 5. Hosting on Heroku

## Database Schema
### Users
| column name    | data type      |  details         |
|----------------|----------------|------------------|
| id             | integer        | not null, PK     |
| username       | string(25)     | not null, unique |
| email          | string(255)    | not null, unique |
| hashedPassword | binary string  | not null         |
| createdAt      | datetime       | not null         |
| updatedAt      | datetime       | not null         |

### Categories
| column name   | data type |  details         |
|-------------  |-----------|------------------|
| id            | integer   | not null, PK     |
| name          | string(50)| not null, unique |
| createdAt     | datetime  | not null         |
| updatedAt     | datetime  | not null         |

### Questions
| column name | data type   |  details               |
|-------------|-------------|------------------------|
| id          | integer     | not null, PK           |
| title       | string(255) | not null               |
| body        | text        | not null               |
| userId      | integer     | not null, FK(User)     |
| categoryId  | integer     | not null, FK(Category) |
| createdAt   | datetime    | not null               |
| updatedAt   | datetime    | not null               |

### Answers
| column name | data type |  details               |
|-------------|-----------|------------------------|
| id          | integer   | not null, PK           |
| body        | text      | not null               |
| userId      | integer   | not null, FK(User)     |
| votes      | integer   | not null, FK(User)     |
| questionId  | integer   | not null, FK(Question) |
| createdAt   | datetime  | not null               |
| updatedAt   | datetime  | not null               |

## Front-end Routes
### `/login`
This page displays a log in form
  * `GET /login`
  * `POST /login`

### `/signup`
This page displays a signup form.

  * `GET /signup`
  * `POST /signup`

### `/`

This is our splash page, which displays cards for each category with a hyperlink to each category, which lists every question within the category, as well as a card that leads to all the questions. Every page will have a navigation bar with login/signup or logout buttons. 
  * `GET /`

### `/questions` & `/categories/:id`

These pages lists all of the questions that belongs to their respective category or all question on the `/questions` page. Each question has an edit and delete button if it belongs to the currently logged in user. Any user can select a question and be redirect to the questions page.
  * `GET /questions`
  * `GET /categories/:id`


### `/questions/new`

This page displays a form with which a logged in user can craft a new question, as well as a navigation bar with logout button.
  * `GET /questions/new` 
  * `POST /questions/new`


## `/questions/:id`

This page displays individual questions with associated answers and votes, as well as a navigation bar with login/signup or logout buttons. If the logged in user owns the question, this page also displays an update and delete button. Logged in users can post answers on this page, and can vote on the answer. The logged in owners of those answers can update or delete them. Logged in users can change or remove their vote.
  * `GET /questions/:id`
  * `GET api/questions/:id/answers`
  * `POST api/questions/:id/answers`
  * `PUT api/answers/:id`
  * `DELETE api/answers/:id`
  * `PUT api/answers/:id/votes`


