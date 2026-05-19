# School Management System (MERN Stack)

## Overview
The School Management System is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It is designed to simplify and digitize administrative operations in educational institutions by providing a centralized platform for managing students, staff, academic standards, and institutional events.

The system supports core CRUD (Create, Read, Update, Delete) operations and provides a structured, scalable, and maintainable architecture suitable for real-world institutional use cases.

## Key Features

- Student Management (Add, Update, Delete, View)
- Staff Management
- Academic Standards/Class Management
- Event Management with Labels
- Dashboard Analytics (basic summaries)
- Search and Filtering functionality
- Image/File Upload support (Multer)
- REST API-based architecture

## Tech Stack

### Frontend
- React.js
- Axios
- React Router

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

### Additional Tools
- Multer (File uploads)
- GitHub (Version control)

## Project Structure

client/ - React frontend application
server/ - Node.js + Express backend

## Installation and Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running locally or cloud instance (MongoDB Atlas)

### Steps to Run Locally

1. Clone the repository
```
git clone <repository-url>
```

2. Navigate to project folder
```
cd school-management-system
```

3. Install dependencies

Frontend:
```
cd client
npm install
```

Backend:
```
cd server
npm install
```

4. Configure environment variables
Create a `.env` file in the server folder:
```
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
```

5. Run the application

Backend:
```
cd server
npm run dev
```

Frontend:
```
cd client
npm start
```

## API Overview
The backend exposes RESTful APIs for managing:

- Students
- Staff
- Standards
- Events
- Event Labels

Common endpoints include:
- GET /api/students
- POST /api/students
- PUT /api/students/:id
- DELETE /api/students/:id

(similar structure applies for other modules)

## Future Enhancements

- JWT Authentication and Authorization
- Role-based access control
- Online fee payment integration
- Attendance management system
- Notification system (email/SMS)
- Cloud deployment (AWS/Render/Vercel)
- Mobile application support

## Project Status

This project is currently in a functional development stage with core administrative features implemented. Advanced features such as authentication and payment integration are planned for future releases.

## License

This project is for academic and learning purposes.

## Author

Ireane Jenifer J

