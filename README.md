# DevRev On-Campus Project Round

Library Management using MERN is a full-stack web application that allows users to manage books, borrowers, and borrowing transactions in a library setting. It utilizes the MERN stack, which includes MongoDB for the database, Express.js for the server, React.js for the frontend, and Node.js for the backend. With this application, users can perform operations such as adding new books, tracking borrowed books, managing borrower details, and generating reports. The application provides an intuitive and user-friendly interface for efficient library management.

## Tech Stack

**Client:** React, Redux

**Server:** Node, Express , Passport JS , PassportJs

## Features

- User Registration and Authentication
- Book Catalog
- Book Search and Filters
- Borrowing and Return Management
- User Profile Management
- Administrative Dashboard
- Integration with External APIs

## Run Locally

move into LibraryManagement folder

```bash
cd LibraryManagement
```

move into server and install node dependencies for server side

```bash
cd server
npm i
```

install react dependencies in client folder

```bash
cd ..
cd client
npm i
```

run node backend in other shell

```bash
npm start
```

run react frontend in third shell

```bash
cd ..
cd client
npm start
```

## Landing Page

Here you can ckick on GO!! to move to login/signup page

## Login/Signup

Here you can Login
You can create a new account with your valid email provided by the institute. Note: the email will work only if you belong to Biotech department.

## Profile Page

The page will contain your personal information.
You can edit your name, phone number and Address.
For users, there will be a feedback form. Users can put queries to that. There will also be a table below that mentioning the queries put up by the user and their status. The users can delete them as well.
For admin, the table will contain all the queries so far. The admin can change their statuses to accepted or rejected. The admin can also delete any query.

## Books Page

This page contains the information about the Library
For admin, it contains the list of users sorted with their username from top to bottom. The admin the also search them with name or username. The admin can also see the list of books available and use its search bar to search with book title, author or genre.
For users, it contains the list of books available and option to put to cart. The user can use the search bar to search with book title, author or genre.

## Cart Page

This page is for users.
The users can see what all books they have in cart to get approved by the admin and what all books they have borrowed.
The user can request to return a book here.

## Check-Borrow Page

This page is for admin.
The checklist is set in sorted order of username. He can also use search bar to search book, borrower or author. The status column shows status as borrowed or accept return button. If a user has put request to return then the admin can accept it using return accept button which will be visible in the status column aginst that book.
The adin can approve or remove books from checklist for individual users.
The admin can also cheout the books individually.