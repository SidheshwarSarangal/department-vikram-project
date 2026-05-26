# Run Locally

First install the nodejs, in the following link, click on the windows installer .msi(may be present on the bottom left in the link) -

```bash
https://nodejs.org/en/download
```

Then install the vs code(this is the code editor) -

```bash
https://code.visualstudio.com/
```

Now install git -

```bash
https://git-scm.com/?utm_source=chatgpt.com
```

Now create a new blank folder on the desktop, and open vs code. Go to files option and click open folder. Now browse to desktop and select the new blank folder which you created.
Now, go to terminal option on the top right and then click on new terminal in the vs code.

A terminal window will appear on the bottom. there type the following line and press enter - 

```bash
git clone https://git-scm.com/?utm_source=chatgpt.com
```

Now, now in that terminal type the following(moving into LibraryManagement) 

```bash
cd LibraryManagement
```

Similarly open a new terminal with the above two steps. Two terminals are required for handling the two aspect(front and back)
You will get all the terminals on the right side of the terminal.

Now in one terminal do this(Move into server and install node dependencies for server side)

```bash
cd server
npm i
```

On the left side of the vs code, you will see the folder structure. There inside the server, create a new file called .env.
Now in the web browser, go the the following and do the sign up -

```bash
https://account.mongodb.com/account/login
```

Go to projects on the top and create a new project.Name it and then click next. Now click on create project. Now you will see create (cluster) button. Select the Free option among the three slides which will appear. Scroll down. You will see AWS to be selected. Scroll down and just click the button creat the create deployment. Now connect to cluster window will pop out of screen. there click Add Current IP Address button. Give a username and password and please note it down. Click on create database. Next click choose a connection method. Select compass. Select "I have MongoDB Compass installed". Select the line appearing below which will appear somewhat like this "mongodb+srv://sidh:<db_password>@cluster0.2klmcmr.mongodb.net/" and then click copy. now just click done.
Now you have to open vs code. there open the .env file inside the server. and then type DB_UR=(paste here what you copied and put the password which you set like this)mongodb+srv://sidh:<db_password>@cluster0.2klmcmr.mongodb.net/. Then do ctrl + s to save the file. In the browser where you had the mongodb website opened, there click on the Database and Network access on the left bar. Select IP address list on the left side bar. Click +add new IP Address and then type 0.0.0.0 in the access entry list and then click confirm.

Now just go to the terminal of the vs code for the server and then just do this and press enter 

```bash
npm start
```
See if there appear any error. else all good up till now.

Now in the another terminal move the client folder in the similar way and do install react dependencies in client folder like this

```bash
cd client
npm install --legacy-peer-deps 
```

Now there itselft do this

```bash
npm start
```

Now a window will open in the browser automatically, showing that the website is running locally. there move to the signup option and create a account with email ending with @bt.iitr.ac.in. and use it sign in. Now for admin, create another account. But for this, you have to go to the mongodb website in the browser, click on browse collections. Click on browse collections.click on test and then users. you will see the list of the users. there, for that user, click on the pen button and then edit the userType from user to admin and then save the changes.
So till here, all the things have been done. you can sign in with user and admin differently to see how the they both work.


---


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
