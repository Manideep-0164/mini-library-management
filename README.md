---
## Deployed Link
⭐ [Live Demo](https://library-management-app-rho.vercel.app/)
---

# LibraryManagement

## Introduction

This TypeScript-based Node.js project is a library management app with role-based access control. Users with different roles (Creator, Viewer, View All) can manage and view books. The app also features endpoints to retrieve books created within the last 10 minutes or more. The TypeScript code is compiled into JavaScript, stored in the ./ folder. Deployed on Vercel for seamless hosting and scalability.

## Key Features

- Book Management
- Real-Time Book Retrieval
- Role-Based Access Control

## Tech Stack

- Backend: Node.js | Express.js
- Database: MongoDB Atlas

## Getting Started

### Installation

1. **Clone the repository:**

   ```shell
   git clone https://github.com/Manideep-0164/mini-library-management.git

   ```

2. **Install Dependencies:**

   ```shell
   cd mini-library-management
   npm install
   ```

3. **Set Environmental Variables(.env)**

   ```shell
   MONGO_URL=your_mongodb_url
   PORT=your_port_number
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the backend server**

   ```shell
   ts-node src/index.ts
   # or
   npm run start
   # or
   npm run dev

   ```

### Endpoints

- POST /register: Register as a new user.
- POST /login: login to access the protected routes.
- POST /books: Create a book.
- GET /books: get the books.

### Usage

- Users can register by providing essential details such as name, email, password, and roles.
- Registered users can log in using their email and password credentials.
- Creators can add new books to the library by providing the book name.
- Utilize /books?old=1 to view books created 10 minutes ago and more
- Use /books?new=1 to display books created less than 10 minutes ago.

### Contact Information

For any queries and feedback, please contact me at [peddaboinimanideep03@gmail.com](mailto:peddaboinimanideep03@gmail.com).

---

<h1 align="center">✨Thank You✨</h1>
