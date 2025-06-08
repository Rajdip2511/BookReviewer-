# Book Reviewer Application

A full-stack web application for managing and reviewing books, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- View list of all books
- Search books by ISBN, author, or title
- User authentication (register/login)
- Add, modify, and delete book reviews
- User profile management
- Responsive design with Bootstrap
- Real-time updates with Redux Toolkit and RTK Query

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Async/Await
- Express Validator
- CORS

### Frontend
- React with Vite
- Redux Toolkit & RTK Query
- React Router v6
- React Bootstrap
- React Icons
- Axios

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-reviewer
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

5. Seed the database with sample data:
```bash
cd backend
node seeder.js
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Books
- GET `/api/books` - Get all books
- GET `/api/books/isbn/:isbn` - Get book by ISBN
- GET `/api/books/author/:author` - Get books by author
- GET `/api/books/title/:title` - Get books by title

### Reviews
- GET `/api/reviews/book/:bookId` - Get reviews for a book
- POST `/api/reviews` - Add a new review (authenticated)
- PUT `/api/reviews/:id` - Update a review (authenticated)
- DELETE `/api/reviews/:id` - Delete a review (authenticated)

### Users
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile (authenticated)
- PUT `/api/users/profile` - Update user profile (authenticated)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 