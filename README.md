## HACKACODE BACKEND

This project is the API for the backend of the TodoCode Hackacode Project. This project constist in a Attractions Park Management System for Ticket Sales. 

### REQUIREMENTS

- "node": "^14.17.0 || ^16.13.0 || >=18.0.0",
- "npm": ">=6.14.13"
- express "^4.18.2",

### PACKAGES

- "bcryptjs": "^2.4.3",
-  "colors": "^1.4.0",
-  "cookie-parser": "^1.4.6",
-  "cors": "^2.8.5",
-  "dotenv": "^16.1.3",
-  "express": "^4.18.2",
-  "express-fileupload": "^1.4.0",
-  "jsonwebtoken": "^9.0.0",
-  "mongoose": "^7.2.2",
-  "morgan": "^1.10.0",
-  "multer": "^1.4.5-lts.1"

### DEV DEPENDENCIES

- nodemon

### SETUP

1 - After cloning the reposirtory, change your directory to the correct path of the project in your terminal

```
cd <your_path>/hackacode_backend
``` 

2 - Install dependencies and packages by running:

```
npm install
```

or

```
yarn add
```

3 - 
### MONGODB

This project uses mongodb to store data in a nosql database.

Go to https://account.mongodb.com and create and account.

4 - Once you are logged in, create a new project with your own settings

5 - Add a username and password to your database

6 - Select wether you want to be able to access your DB from any IP address or not.

7 - Once you have created your DB, click on connect and "MongoDB for VSCode"

8 - In the config directory open config.env and add the following variable:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.lf0wzgf.mongodb.net/ 
```
### KEYS AND ENV VARIABLES

You´ll need the following environment variables and keys:

```
PORT=5000
NODE_ENV=development

JWT_SECRET=<CREATE YOUR OWN KEY>
JWT_EXPIRE=1000000
JWT_COOKIE_EXPIRE=30

FILE_UPLOAD_PATH= <ADD THE DIRECTORY WHERE YOU WANT TO STORE FILES> e.g ./public/uploads
MAX_FILE_UPLOAD=30d
```
Your are now set to start your development server by running in your terminal the following command line:

```
npm run dev
```
