# Mini Employee Management Portal (MERN Stack)

A full-stack **Employee Management Portal** built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
This project demonstrates clean architecture, JWT authentication, REST APIs, and modern frontend practices.

---

##  Project Overview

The application allows an authenticated admin user to:
- Log in securely with JWT authentication
- View a comprehensive dashboard with statistics
- Create, view, update, and delete employees
- Manage employee information with a modern card-based UI
- Real-time data synchronization with MongoDB

This project was built as a **full-stack developer assignment** with focus on:
- Clean code structure
- Scalable architecture
- Modern UI/UX design
- Secure API integration
- Production-ready practices

---

##  Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Stateless authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management

---

##  High-Level Architecture

```
┌───────────────┐
│   React UI    │
│  (Frontend)   │
└───────┬───────┘
        │ HTTP (Axios + JWT)
        ▼
┌───────────────┐
│  Express API  │
│   (Backend)   │
└───────┬───────┘
        │ Mongoose ODM
        ▼
┌───────────────┐
│   MongoDB     │
│  (Database)   │
└───────────────┘
```

---

##  Architectural Principles

- **Separation of Concerns** - Clear division between layers
- **Stateless Authentication** - JWT-based auth without server sessions
- **RESTful API Design** - Standard HTTP methods and status codes
- **Modular Structure** - Organized by features and concerns
- **Error Handling** - Comprehensive error management
- **Security Best Practices** - Password hashing, token validation

---

##  Folder Structure

```
employee-management-portal/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   └── seed.js               # Seed admin user
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   └── employee.controller.js # CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.middleware.js    # JWT verification
│   │   ├── models/
│   │   │   ├── user.model.js         # User schema
│   │   │   └── employee.model.js     # Employee schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Auth endpoints
│   │   │   └── employee.routes.js    # Employee endpoints
│   │   ├── app.js                    # Express app setup
│   │   └── server.js                 # Server entry point
│   │
│   ├── .env                          # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios configuration
│   │   ├── components/
│   │   │   └── SummaryCard.jsx       # Reusable components
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   └── Dashboard.jsx         # Dashboard with CRUD
│   │   ├── App.jsx                   # Root component
│   │   └── main.jsx                  # Entry point
│   │
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication Flow (JWT)

1. **Admin logs in** with email & password
2. **Backend verifies** credentials against hashed password
3. **Backend generates** a signed JWT token
4. **JWT is sent** to frontend in response
5. **Frontend stores** token in sessionStorage
6. **Token attached** to every protected API request via Axios interceptor

### Authorization Header Format
```
Authorization: Bearer <JWT_TOKEN>
```

### Why JWT?
- **Stateless** - No server-side sessions needed
- **Secure** - Cryptographically signed
- **Scalable** - Works across distributed systems
- **Standard** - Industry-standard for REST APIs

---

## Seeded Admin User

A default admin user is automatically created using the seed script.

| Field    | Value          |
|----------|----------------|
| Email    | admin@test.com |
| Password | admin123       |

Run the seed script once:
```bash
cd backend
npm run seed
```

---

##  Backend API Endpoints

### Authentication
| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| POST   | `/api/auth/login` | Login and receive JWT |

### Employees (Protected Routes)
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/employees`      | Get all employees        |
| POST   | `/api/employees`      | Create new employee      |
| PUT    | `/api/employees/:id`  | Update employee by ID    |
| DELETE | `/api/employees/:id`  | Delete employee by ID    |

All employee routes require valid JWT token in Authorization header.

---

##  Frontend Features

### Modern UI/UX
-  **Gradient backgrounds** and smooth transitions
-  **Card-based layouts** for employee display
-  **Dashboard statistics** with real-time data
-  **Loading states** and error handling
-  **Fully responsive** design
-  **Modal dialogs** for create/edit operations

### Dashboard Statistics
- **Total Employees** - Live count from database
- **New This Month** - Employees added in last 30 days
- **Top Department** - Department with most employees

### Employee Management
- Create employees with validation
- Edit existing employee details
- Delete with confirmation dialog
- View all employees in card layout
- Avatar initials for visual identification

---

##  Environment Variables

### Backend `.env`
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/employee_portal
JWT_SECRET=supersecretkey
```

> **Note:** Port 5001 is used to avoid macOS AirPlay conflict on port 5000.

### Frontend
No environment variables required for development. Axios is configured to use `http://localhost:5001`.

---

## ▶️ Running the Application

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Seed admin user (run once)
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5001`

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173` (Vite default)

---

##  API Testing

Test the backend using:
- **Thunder Client** (VS Code extension)
- **Postman**
- **curl**
- **Insomnia**

### Example: Login Request
```http
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Example: Create Employee (Protected)
```http
POST http://localhost:5001/api/employees
Content-Type: application/json
Authorization: Bearer <YOUR_JWT_TOKEN>

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Software Engineer",
  "department": "Engineering"
}
```

---

##  Key Design Decisions

### Backend
- **MongoDB** for flexible, document-based storage
- **Express.js** for lightweight REST API framework
- **JWT over sessions** for stateless, scalable authentication
- **MVC pattern** for clean separation of concerns
- **Middleware-based auth** for route protection

### Frontend
- **Vite** for faster builds and HMR
- **Tailwind CSS** for rapid, utility-first styling
- **Axios interceptors** for automatic JWT attachment
- **Card layout** instead of tables for better UX
- **Modal pattern** for forms instead of separate pages

---

##  Features Implemented

 **Authentication**
- Secure login with JWT
- Password hashing with bcrypt
- Protected routes with middleware
- Automatic token attachment

 **Dashboard**
- Real-time statistics
- Employee count tracking
- Department analytics
- Recent hires tracking

 **Employee Management**
- Full CRUD operations
- Form validation
- Error handling
- Success feedback
- Confirmation dialogs

 **UI/UX**
- Modern, gradient design
- Responsive layout
- Loading states
- Empty states
- Smooth animations

---

##  Future Enhancements

### Security
- [ ] Implement refresh tokens
- [ ] Add rate limiting
- [ ] Enable HTTPS in production
- [ ] Add CSRF protection

### Features
- [ ] Role-based access control (Admin, Manager, User)
- [ ] Employee profile pictures
- [ ] Advanced search and filters
- [ ] Pagination for large datasets
- [ ] Export to CSV/PDF
- [ ] Email notifications

### Technical
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] API documentation (Swagger)
- [ ] TypeScript migration
- [ ] Redis caching

### Deployment
- [ ] Deploy backend to Render/Railway
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Use MongoDB Atlas for database
- [ ] Set up environment-based configs

---

##  Assignment Requirements Fulfilled

✔️ Secure login page with authentication  
✔️ Dashboard with statistics  
✔️ Complete employee CRUD operations  
✔️ Modern, responsive UI  
✔️ Database persistence with MongoDB  
✔️ Clean, maintainable code architecture  
✔️ Comprehensive documentation  
✔️ Error handling and validation  
✔️ RESTful API design  
✔️ JWT-based authentication  

---

##  Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port Already in Use
```bash
# Find and kill process using port 5001
lsof -ti:5001 | xargs kill -9

# Or change PORT in .env file
```

### JWT Token Issues
- Ensure token is properly stored in sessionStorage
- Check Authorization header format: `Bearer <token>`
- Verify JWT_SECRET matches between requests

---

##  Project Highlights

### For Interviewers/Reviewers
This project demonstrates:
- **Full-stack proficiency** in MERN stack
- **Security best practices** with JWT and bcrypt
- **Clean architecture** with separation of concerns
- **Modern frontend** with React hooks and Tailwind
- **RESTful API design** following industry standards
- **Production-ready code** with error handling
- **Clear documentation** and code comments

### Code Quality
- Modular and maintainable structure
- Consistent naming conventions
- Error handling at every layer
- Input validation and sanitization
- Secure authentication flow
- Responsive and accessible UI

---

##  Author

**Vikranth Bolleddula**  
Full Stack Developer (MERN)  
[GitHub](https://github.com/vikranth666) | [LinkedIn](https://linkedin.com/in/b-vikranth)

---

##  License

This project is open source and available for educational purposes.

---

##  Contributing

While this is an assignment project, suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Email: vikranth@example.com

---

**If you found this project helpful, please consider giving it a star!**

---

*Last Updated: January 2025*