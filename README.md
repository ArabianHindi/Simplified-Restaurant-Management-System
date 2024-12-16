# Restaurant Management System API

This project is a **Restaurant Management System API** built using **Node.js**, **Express**, and **Sequelize** for managing users, menus, orders, and reports. It includes features like user authentication, role-based access control, and data export capabilities.

---

## Features

### User Management
- **Sign Up**: Users can sign up with `username`, `password`, and `role` (`admin` or `staff`).
- **Login**: Users can log in and receive a JWT token for authentication.
- **Password Reset**: Users can request a password reset and reset their password using a unique token.

### Menu Management (Admins Only)
- **CRUD Operations**: Admins can create, read, update, and delete menu items.
- **Filtering and Sorting**: Menu items can be filtered by category and sorted by price.

### Order Management
- **Staff**:
  - Create new orders.
  - Add or remove items from orders (only if the order is `pending`).
  - Mark orders as complete.
- **Admins**:
  - View all orders with their details.
  - Delete pending orders.
  - Update the status of orders (`pending` → `complete` or `expired`).

### Reports
- **Order Reports**: Export order data for a specific date range in CSV or XLSX format.
- **Top-Selling Items**: Export the top 10 selling menu items in the last 30 days in CSV or XLSX format.

### Automated Cron Jobs
- Pending orders older than 4 hours are automatically marked as `expired`.

---

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework.
- **Sequelize**: ORM for database management.
- **MySQL**: Database used for storing data.
- **Redis**: Used for caching and TTL for orders.(Not Implemented in this Version)
- **Cron**: Scheduled tasks.
- **JWT**: Authentication using JSON Web Tokens.
- **bcrypt**: Password hashing.

---

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v14 or later),This project was made with version v20.11.0
- **MySQL** (or any compatible relational database)
- **Postman** (optional, for API testing)

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ArabianHindi/Simplified-Restaurant-Management-System
   cd Simplified-Restaurant-Management-System-main
2. **Install Dependencies**:
   ```bash
   npm install
3. **Set Up the Database**:
  -Create a database named `restaurant_db` in your MySQL instance.
  -Update the `.env` file with your database credentials.
4. **Set Up Environment Variables: Create a `.env` file in the root directory**:
   ```bash
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=yourpassword
    DB_NAME=restaurant_db
    JWT_SECRET=your_jwt_secret
5. **Start the Server**:
   ```bash
   npm start
  The server will run on http://localhost:3000.
6. **Postman Link to workspace to test the endpoints**
https://warped-astronaut-661053.postman.co/workspace/GeekyAir-Assessment-Endpoints~3af2d44a-9659-42d3-b0d8-edaf6b66ee32/request/28422182-c1bca3b5-ca3b-4c0d-8f1f-c129ec78b29d
  
---
# API Endpoints Documentation

## Authentication

- **POST /auth/signup**: User sign-up.

- **POST /auth/login**: User login.

- **POST /auth/reset-password-request**: Request a password reset link.

- **POST /auth/reset-password/:token**: Reset the password using a token.

---

## Menu Management

- **POST /menu**: Create a menu item (Admin only).

- **GET /menu**: Get menu items (with filtering and sorting).

- **PUT /menu/:id**: Update a menu item (Admin only).

- **DELETE /menu/:id**: Delete a menu item (Admin only).

---

## Order Management

### Staff

- **POST /orders/:id/items**: Add an item to an order.

- **DELETE /orders/:orderId/items/:itemId**: Remove an item from an order.

- **PUT /orders/:id/complete**: Mark an order as complete.

### Admin

- **POST /orders**: Create a new order.

- **GET /orders**: View all orders with details.

- **DELETE /orders/:id**: Delete a pending order.

- **PUT /orders/:id/status**: Update the status of an order (pending → complete or expired).

---

## Reports

- **GET /orders/report**: Export orders in CSV or XLSX format for a given date range.

- **GET /menu/top-selling**: Export top 10 selling items in the last 30 days.
---

## Endpoints Request and Responses

### User Management

- **Sign Up**  
  - **POST** `/auth/signup`  
  - **Request Body**:
    ```json
    {
      "username": "example_user",
      "password": "example_password",
      "role": "admin" | "staff"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "User signed up successfully.",
      "user": {
        "id": 1,
        "username": "example_user",
        "role": "staff"
      }
    }
    ```

- **Login**  
  - **POST** `/auth/login`  
  - **Request Body**:
    ```json
    {
      "username": "example_user",
      "password": "example_password"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Login successful.",
      "token": "jwt_token_here"
    }
    ```

- **Password Reset Request**  
  - **POST** `/auth/reset-password`  
  - **Request Body**:
    ```json
    {
      "username": "example_user"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Password reset link sent successfully."
    }
    ```

- **Password Reset**  
  - **PATCH** `/auth/reset-password/:token`  
  - **Request Body**:
    ```json
    {
      "new_password": "new_secure_password"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Password reset successfully."
    }
    ```

---

### Menu Management (Admins Only)

- **Create Menu Item**  
  - **POST** `/menu`  
  - **Request Body**:
    ```json
    {
      "name": "Pizza",
      "description": "Cheese Pizza",
      "price": 9.99
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Menu item created successfully.",
      "menu": {
        "id": 1,
        "name": "Pizza",
        "description": "Cheese Pizza",
        "price": 9.99
      }
    }
    ```

- **Get All Menu Items**  
  - **GET** `/menu`  
  - **Response**:
    ```json
    [
      {
        "id": 1,
        "name": "Pizza",
        "description": "Cheese Pizza",
        "price": 9.99
      },
      {
        "id": 2,
        "name": "Burger",
        "description": "Beef Burger",
        "price": 8.99
      }
    ]
    ```

- **Update Menu Item**  
  - **PATCH** `/menu/:id`  
  - **Request Body**:
    ```json
    {
      "name": "Updated Pizza",
      "price": 10.99
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Menu item updated successfully.",
      "menu": {
        "id": 1,
        "name": "Updated Pizza",
        "price": 10.99
      }
    }
    ```

- **Delete Menu Item**  
  - **DELETE** `/menu/:id`  
  - **Response**:
    ```json
    {
      "message": "Menu item deleted successfully."
    }
    ```

---

### Order Management

- **Create Order (Staff Only)**  
  - **POST** `/orders`  
  - **Request Body**:
    ```json
    {
      "created_by": "staff_username"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Order created successfully.",
      "order": {
        "id": 1,
        "status": "pending",
        "created_by": "staff_username"
      }
    }
    ```

- **Update Order Status (Admins Only)**  
  - **PATCH** `/orders/:id`  
  - **Request Body**:
    ```json
    {
      "status": "completed"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Order updated successfully.",
      "order": {
        "id": 1,
        "status": "completed"
      }
    }
    ```

- **Delete Pending Order (Admins Only)**  
  - **DELETE** `/orders/:id`  
  - **Response**:
    ```json
    {
      "message": "Pending order deleted successfully."
    }
    ```

---

### Reporting (Admins Only)

- **Export Orders**  
  - **GET** `/reports/orders?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`  
  - **Description**: Exports all orders within the provided date range as a CSV/XLSX file.  
  - **Response**:
    ```json
    {
      "message": "Report generated successfully.",
      "file_url": "path_to_report_file"
    }
    ```

- **Export Top-Selling Items**  
  - **GET** `/reports/top-items`  
  - **Description**: Exports the top 10 best-selling menu items in the last 30 days.  
  - **Response**:
    ```json
    {
      "message": "Report generated successfully.",
      "file_url": "path_to_report_file"
    }
    ```
## Folder Structure
``` bash
project/
│
├── routes/               # API route files
│   ├── userRoutes.js     # User-related routes
│   ├── menuRoutes.js     # Menu-related routes
│   ├── orderRoutes.js    # Order-related routes
│   └── reportRoutes.js   # Report-related routes
│
├── middleware/           # Middleware for authentication and authorization
│   ├── authenticateUser.js
│   ├── isAdmin.js
│   └── isStaff.js
│
├── models/               # Sequelize models
│   ├── User.js
│   ├── MenuItem.js
│   ├── Order.js
│   └── OrderItems.js
│
├── seeders/              # Seeder files for populating the database
│   └── seederDB.js
│
├── config/               # Configuration files
│   └── database.js
│
├── .env                  # Environment variables
├── index.js              # Main entry point
├── package.json          # Dependencies and scripts
└── README.md             # Documentation
