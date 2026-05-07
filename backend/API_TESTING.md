# API Testing Guide

## Health Check

```bash
curl http://localhost:5000/api/health
```

## User Management

### Get All Users

```bash
curl http://localhost:5000/api/users
```

### Get User by ID

```bash
curl http://localhost:5000/api/users/USER_ID
```

### Create New User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Update User

```bash
curl -X PUT http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

### Delete User

```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID
```

## Testing with Postman

1. Import the collection from this API
2. Set `{{base_url}}` variable to `http://localhost:5000`
3. Test each endpoint

## Expected Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

## Status Codes

- `200` - OK (Success)
- `201` - Created (Resource created)
- `400` - Bad Request (Invalid input)
- `404` - Not Found (Resource not found)
- `500` - Internal Server Error

## Testing with Node.js

Create `test.js`:

```javascript
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

// Health check
const health = await fetch(`${API_URL}/health`);
console.log('Health:', await health.json());

// Create user
const createRes = await fetch(`${API_URL}/users`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
});
console.log('Created:', await createRes.json());
```

Run with: `node test.js`
