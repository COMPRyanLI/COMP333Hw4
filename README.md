# COMP333Hw4

## The basic introduction of the app

The app is a music rating ReactNative mobile app for Android. This app allows 
- Create a new song in a database with title, artist, and rating
- Read a list of songs from the database with title, artist, and rating
- Update title, artist, and rating of an existing song in the database
- Delete a song (title, artist, and rating) from the database

! In Update and create a new song, if the rating is not within the range from 1 to 5, there will be an error message.

! If you add a song that is already added by other users, the user will be alerted and stay at the add song page.

! In registration, you have to enter a password that has at least 10 digits. And you are not allowed to enter the user name that is already taken. If so You will not be allowed to login with the username and password, users would be alert in registration stage. 

! Addsong, update and delete pages all have cancel button.

! Little inconvenience: For the login and registration, the keyboard of the phone would disapper once user enters something. Please be patient and click the entry field again and the keyboard would appear again.

!!!Extra function: search data based on artist name

## How to run the app
1. open XAMPP and React and Android Studio on your computer.
2. Start MySQL databse and Apache Web Server on XAMPP and create database required using following SQL in Mysql terminal.
``` sql
CREATE DATABASE music_db;
```
 ``` sql
CREATE TABLE users (username VARCHAR(255) PRIMARY KEY, password VARCHAR(255));
```
 ``` sql
CREATE TABLE ratings (id int(11) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    artist VARCHAR(255),
    song VARCHAR(255),
    rating int(1),
    FOREIGN KEY (username) REFERENCES users(username));
```
3. Copy Controller folder, inc folder and Model folder and index.php to htdocs folder in your XAMPP folder.
4. creating your app by running `npx create-expo-app <yourappname>`. To initialize a React Native app `cd` into the `<yourappname>` directory.
5. Copy and paste these following files into your directory: App.js, edit.js, add.js, delete.js, searchSong.js.
6. run the following code
``` bash
npx expo start
```
7.  In your command line, you should see a URL for your app. Copy and paste the URL into your emulator. Click "Connect". Then start using the app.

# REST api(backend code)
```bash
.├── Controller
│   └── Api
│       ├── BaseController.php
│       └── UserController.php
├── inc
│   ├── bootstrap.php
│   └── config.php
├── index.php
└── Model
    ├── Database.php
    └── UserModel.php
```

The REST api has been fully tested through POSTMAN. All functions are working well.

## addtional function: search function 
After the user is logged in, at the bottom of the page. There is a button with title of "search". If the button is pressed, it would lead user to searchscreen. There is a entry field and a "search" button. The user can enter artist that is shown on the list and get the songs and ratings that are related to the artist entered.

##  js files that are important
1. App.js(main functions) 
2. add.js(function component: add new song) 
3. delete.js(function component: delete song) 
4. edit.js(function component: update a song) 
5. searchSong.js(function component: search function) 


## contribution rate:
Ryan:50% Lance:50%
