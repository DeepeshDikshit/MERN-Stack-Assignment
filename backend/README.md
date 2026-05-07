# MERN Backend API

A production-ready Express.js backend setup with MongoDB, featuring ES Modules, centralized error handling, and scalable architecture.

## Features

- ✅ **Express.js Server** - Fast and minimalist web framework
- ✅ **MongoDB with Mongoose** - Robust database connectivity with ODM
- ✅ **ES Modules** - Modern JavaScript module syntax
- ✅ **dotenv** - Environment variable management
- ✅ **CORS & JSON Middleware** - Request handling and cross-origin support
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Logging** - Request logging middleware
- ✅ **Nodemon** - Auto-restart on file changes during development
- ✅ **Scalable Structure** - Clean separation of concerns

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MongoDB connection
│   │   └── constants.js # Constants and enums
│   ├── models/          # Mongoose models
│   │   └── User.js      # Sample User model
│   ├── controllers/     # Business logic
│   │   └── userController.js
│   ├── routes/          # API routes
│   │   └── userRoutes.js
│   ├── middleware/      # Custom middleware
│   │   ├── errorHandler.js  # Error handling
│   │   └── logger.js        # Request logging
│   └── app.js           # Express app setup
├── server.js            # Server entry point
├── package.json         # Dependencies and scripts
├── nodemon.json         # Nodemon configuration
├── .env.example         # Environment variables template
└── .gitignore          # Git ignore rules
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env  # or use your preferred editor
   ```

3. **Configure MongoDB Connection**
   - For local MongoDB:
     ```
     MONGODB_URI=mongodb://localhost:27017/mern-app
     ```
   - For MongoDB Atlas:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-app?retryWrites=true&w=majority
     ```

## Development

### Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` and automatically restart when you make changes.

### Start Production Server

```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running

### User Management
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Example Request (Create User)

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Error Handling

The application uses centralized error handling with custom error classes and middleware:

- **ValidationError** - Returns 400 status
- **DuplicateKeyError** - Returns 400 status
- **JWT Errors** - Returns 401 status
- **Not Found** - Returns 404 status
- **Server Error** - Returns 500 status

All errors follow a consistent response format:
```json
{
  "success": false,
  "message": "Error message",
  "stack": "Stack trace (development only)"
}
```

## Extending the Application

### Add a New Model

Create `src/models/YourModel.js`:
```javascript
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // Define your schema
}, { timestamps: true });

export default mongoose.model('YourModel', schema);
```

### Add New Routes

1. Create controller in `src/controllers/yourController.js`
2. Create routes in `src/routes/yourRoutes.js`
3. Import and use in `src/app.js`:
   ```javascript
   import yourRoutes from './routes/yourRoutes.js';
   app.use('/api/your-endpoint', yourRoutes);
   ```

### Add Custom Middleware

Create middleware in `src/middleware/yourMiddleware.js` and use in `app.js`:
```javascript
app.use(yourMiddleware);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/mern-app |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `JWT_SECRET` | JWT secret key | (required for JWT) |
| `JWT_EXPIRE` | JWT expiration time | 7d |

## Production Deployment

1. **Set Environment Variables**
   ```bash
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   CORS_ORIGIN=your-frontend-url
   JWT_SECRET=your-secure-secret-key
   ```

2. **Start Server**
   ```bash
   npm start
   ```

3. **Use Process Manager** (Recommended)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "mern-backend"
   ```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **axios** - HTTP client
- **cheerio** - Web scraping

## Dev Dependencies

- **nodemon** - Development server with auto-reload

## Best Practices

✅ **Error Handling** - Use `catchAsyncErrors` wrapper for async routes
✅ **Validation** - Validate all inputs before processing
✅ **Security** - Use bcryptjs for passwords, never store plain text
✅ **Environment** - Always use environment variables for sensitive data
✅ **Logging** - Use the logging middleware for debugging
✅ **Scalability** - Keep models, controllers, and routes separate

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your connection string
- Verify IP whitelist on MongoDB Atlas

### Port Already in Use
```bash
# Change PORT in .env or:
PORT=5001 npm run dev
```

### Nodemon Not Restarting
- Check that `src` and `server.js` files are being saved
- Restart nodemon manually

## License

ISC
