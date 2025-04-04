# Snake Game with User Authentication and Leaderboard

This 3D Snake game includes user authentication and a leaderboard system to track high scores.

## Environment Setup

1. Create a `.env.local` file in the root of your project with the following variables:

```
# MongoDB Connection String
MONGODB_URI=your_mongodb_connection_string

# JWT Secret for authentication
JWT_SECRET=your_secret_key_for_jwt
```

2. Replace `your_mongodb_connection_string` with your MongoDB connection string. You can use MongoDB Atlas for a free cloud-hosted MongoDB instance: https://www.mongodb.com/cloud/atlas

3. Replace `your_secret_key_for_jwt` with a secure random string for JWT token signing. You can generate one using:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## MongoDB Setup

1. Create a free MongoDB Atlas account if you don't have one
2. Create a new cluster
3. Create a database user with read/write privileges
4. Whitelist your IP address in the Network Access settings
5. Get your connection string from the "Connect" button on your cluster
6. Replace `<username>`, `<password>`, and `<dbname>` in the connection string with your actual values

## Features

- User registration and login
- Track highest scores for each user
- Leaderboard showing top 10 players
- Responsive UI for both desktop and mobile
- Secure password storage with bcrypt hashing
- JWT-based authentication with HTTP-only cookies

## API Routes

- `/api/auth/register` - Register a new user
- `/api/auth/login` - Log in an existing user
- `/api/auth/logout` - Log out the current user
- `/api/auth/me` - Get the current user's profile
- `/api/scores/update` - Update the user's score
- `/api/scores/leaderboard` - Get the top 10 players
