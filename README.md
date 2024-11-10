# Registration Form Application

Interview Project for Intern Position

## Project Overview

This project is designed to implement a complete client-server web application that provides essential user account functionalities. The application allows users to register, log in, update their profiles, and log out with a clean, user-friendly interface and secure backend processing.

Users who open the web application will see a home page with navigation options for Registration (to create a new account) and Login (to access an existing account). Once registered or logged in, the navigation menu updates to display new options for Profile Change (allowing users to update personal information and credentials) and Logout (to securely exit the application). The application provides basic yet comprehensive error handling with specific error messages and a custom 404 page.

## Key Functionalities

1. **User Registration**: Enables new users to create an account by providing necessary information.
2. **User Login**: Allows registered users to log in using their credentials.
3. **Profile Update**: Users who are logged in can modify their personal information and update their password.
4. **Logout**: Users can log out securely, which resets the session and returns them to the homepage.

## Project Requirements

This project is built to demonstrate core programming principles and does not utilize external web frameworks. Below are the requirements and constraints followed during development:

- **No Web Framework**: The application is created entirely with core Node.js, emphasizing pure JavaScript server-side development without frameworks like Express.
- **Data Validation**: All user inputs, including names, email, and password, are validated to ensure correctness and security.
- **Data Persistence**: Data is stored in a relational database (MySQL) for persistence and easy retrieval.
- **Session Management**: Login, logout, and profile management functionalities are implemented to ensure secure access.
- **Unit Testing**: Core functionalities are covered by unit tests to ensure reliability. **NOT PROVIDED**
- **Custom CAPTCHA**: A custom CAPTCHA system is used to enhance security and protect against automated submissions.

## Technologies used:
1. **Node.js**: Pure Node.js is used for the backend.
2. **MySQL**: Relational database management system for storing user data.
3. **HTML5 and CSS3**: HTML and CSS are used for the frontend providing a visually appealing user interface.

# In depth project description

## Backend part:

### **db.js** file

#### Purpose:

This file configures and manages a connection to a MySQL database using node.js and environment variables. It provides a streamlined way to execute database queries with error handling and connection management.

#### Technologies Used:

- dotenv: Loads environment variables from a .env file, ensuring sensitive database credentials are not hard-coded.
- mysql2: MySQL client library for connecting and querying a MySQL database.

#### How It Works:

1. Configuration: The dotenv package loads database connection details from the environment, and mysql2 establishes a connection with credentials specified in .env.
2. Query Execution: The executeQuery function accepts SQL queries and parameters, executes them against the database, and returns the results through a callback function.
3. Graceful Shutdown: Listens for process termination (SIGINT) to close the MySQL connection safely, ensuring the application exits cleanly without leaving open connections.

### **server.js** file

#### Purpose:

This file defines an HTTP server that supports essential functionality for a registration-based web application, including serving web pages, handling registration and login requests, managing user profiles, and enforcing CAPTCHA verification. It directly handles HTTP requests and dynamically serves HTML templates based on user actions.

#### Technologies Used:

- Node.js HTTP Core Module - Provides core HTTP server capabilities, enabling the handling of requests and responses.
- File System (fs) - Reads HTML templates and static files from the server’s file system.
- URL and Query String Modules - Parses URL parameters and query strings, assisting in request handling and routing.
- Custom module imports - Provide additional functionality and custom logic

#### How It Works:

1. Routing: The server identifies the request URL and method, then routes it to the corresponding function to handle actions like serving pages, registering users, logging in, or updating profiles.
2. Static File Serving: If a request targets a static resource, the server determines the file type, sets the appropriate MIME type, and serves it.
3. Dynamic Page Rendering: Templates are dynamically populated based on the user’s session status.

#### User Management:

- Registration: Validates and hashes passwords, checks CAPTCHA, and stores user details in the database.
- Login: Validates credentials, including CAPTCHA, and allows users access to profile pages on successful authentication.
- Profile Update: Updates profile details in the database with validation checks for names, email, and passwords.
- Logout: Clears the session by setting currentUser to null, then redirects users to the homepage.

#### Error Handling and 404 Page: 

Any requests not recognized by the server return a custom 404 page, ensuring a consistent user experience. Additionally, the server handles errors gracefully when reading files or querying the database.

### **utils.js** file

#### Purpose:

This utility module provides core functionality for data validation, password hashing, and CAPTCHA generation, supporting key operations within the user registration, login, and profile management system of the application.

#### Technologies Used:

- Crypto Module - Implements secure hashing for passwords.
- Canvas Module - Generates CAPTCHA images.

#### How It Works:

#### Data validation:

1. Name Validation: validateName function uses a regex to ensure that names contain only alphabetic characters, with a maximum length of 100 characters.
2. Email Validation: validateEmail function uses a regex to enforce valid email format and restricts length to 100 characters.
3. Password Validation: validatePassword function ensures that passwords are between 8 and 16 characters and that they match the confirmation password.

#### Password Management:

1. Hashing: hashPassword function applies SHA-256 hashing to plaintext passwords.
2. Comparison: comparePasswords function hashes the provided password and compares it to the stored hash.

#### CAPTCHA Generation:

1. Captcha Code: generateCaptcha function creates a random, five-character alphanumeric string.
2. Captcha Image: Using the Canvas API, this code is drawn onto a 120x40 canvas, rendered with a background color and styled text.

## Frontend part:

### **templates** and **styles** folder:

Contains the templates and CSS modules that work together to create the front-end user interface for the web application. The HTML templates provide structured layouts for each page, while the CSS module adds consistent styling for better UX.

### -> Templates

#### **home.html**

This template serves as the main landing page of the application, welcoming users and offering navigation options based on their login status.

#### **register.html**

Provides the layout for user registration form, featuring fields for first name, last name, email, password, confirm password and captcha.

#### **login.html**

Provides a login form where users can input their email, password and captcha to access the application.

#### **change-profile.html**

Allows logged-in users to update their personal information, such as names, email, and password.
Fields are pre-filled with the user's existing data for convenience.

#### **404.html**

A dedicated error page shown when users attempt to access unavailable resources.

### -> CSS stylessheets

Custom CSS3 styles for each of the HTML templates that ensures a visually engaging interface.

# Project Setup
To the test the project locally, simply clone the github repository and install the node modules required for the application by using the command `npm install` or `npm i`. After installing the required node modules, you can start the server using the `node server.js` command.

Enjoy :)