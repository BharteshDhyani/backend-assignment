# App Backend

This project is a Node.js backend application built with TypeScript. It provides a RESTful API for managing teams and templates, with built-in authentication and API documentation.

## Features

*   **Team Management:** Create, update, delete, and manage teams and team members.
*   **Template Management:** Create, update, delete, and manage templates.
*   **Authentication:** JWT-based authentication for securing API endpoints.
*   **API Documentation:** Swagger UI for interactive API documentation.
*   **Database:** Uses Mongoose for MongoDB object data modeling.

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd backend-assignment-2025
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or if you are using pnpm:
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. You can use the `.env.example` file as a template.

## Running the Project

To start the development server, run the following command:

```bash
npm run start
```

## API Documentation

When the server is running, you can access the API documentation at `http://localhost:8080/documentation/`.
