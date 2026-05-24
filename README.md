# Gut Games – Technical Documentation

Gut Games is a web application of the **Indie Game Portal** type, allowing users to publish their own games, rate them, and build a gaming community.

The platform supports:

- browser-playable games (HTML5 / JavaScript)
- downloadable games

---

# Table of Contents

1. [System Architecture](#system-architecture)
2. [Setup Instructions](#setup-instructions)
3. [Environment Variables](#environment-variables)
4. [API Documentation](#api-documentation)
5. [Backend Structure](#backend-structure)
6. [Frontend Structure](#frontend-structure)
7. [Authorization](#authorization)
8. [Rating and Comment System](#rating-and-comment-system)
9. [Administrator Panel](#administrator-panel)
10. [Developer Notes](#developer-notes)
11. [Possible Extensions](#possible-extensions)
12. [License](#license)

---

# System Architecture

The project consists of two main parts:

```txt
Gut Games
│
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   └── controllers
│
└── frontend
    ├── components
    ├── context
    ├── pages
    └── assets
```

## Technologies Used

### Frontend

- React
- Vite
- Context API
- HTML5 Fullscreen API

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Storage

- Google Cloud Storage (GCS)

---

# Setup Instructions

## Installing Dependencies (Frontend)

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

## Running the Application

```bash
npm run dev
```

By default, the application will run at:

```txt
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# API Documentation

## Authorization

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login and JWT token generation |
| POST | `/api/auth/add` | Add a game (upload to Google Cloud Storage) |

## Games

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/games` | Retrieve a list of all games |
| GET | `/api/games/:id` | Retrieve game details |

## Ratings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/games/:id/rate` | Add a game rating (JWT required) |

## Comments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/games/:id/comments` | Add a comment and rating |

---

# Backend Structure

## Data Models

### `Game.js`

The game schema includes:

- title
- author
- view counter
- rating system

Example fields:

```js
title
author
description
views
ratings
createdAt
```

### `User.js`

User schema:

```js
username
email
passwordHash
isAdmin
createdAt
```

### `Comment.js`

Comment schema:

```js
content
rating
gameId
authorId
createdAt
```

---

# Middleware

## `auth.middleware.js`

Responsible for:

- JWT token verification
- user authorization
- attaching `userId` to the request

## `admin.middleware.js`

Checks whether the user has administrator privileges.

Used to secure administrator panel endpoints.

---

# Routes and Controllers

## `game.routes.js`

Handles:

- retrieving games
- increasing view count
- adding ratings
- adding comments

## `admin.routes.js`

Protected administrative endpoints:

- game moderation
- user management
- statistics overview

## `user.routes.js`

Contains logic for:

- user profile data
- global rankings
- activity history

---

# Frontend Structure

## State Management

### `AuthContext.jsx`

Global context responsible for:

- storing user data
- login handling
- logout handling
- saving session data in `localStorage`

---

# UI Components

## `Navbar.jsx`

Dynamic navigation bar:

- changes depending on login status
- displays administrator panel access

## `GameCard.jsx`

Component representing a single game in the list:

- thumbnail
- title
- number of ratings
- average rating

## `GlitchText.jsx`

Decorative component generating a visual effect:

```txt
glitch / cyberpunk / distortion
```

## `RatingStars.jsx`

Interactive rating component:

- star-based rating system
- click handling
- sending ratings to the API

---

# Pages

## `GamePage.jsx`

Handles:

- game playback
- view counter
- Fullscreen API

## `AdminPanel.jsx`

Administrator panel containing:

- data tables
- search functionality
- filtering
- TOP 10 ranking

## `UserProfile.jsx`

User dashboard:

- list of owned games
- ability to delete games
- activity statistics

---

# Rating and Comment System

Each game can have:

- user ratings
- comments

Ratings are stored in the database and used to calculate the average game score.

---

# Authorization

The system uses JWT (JSON Web Token).

Process:

1. The user logs in
2. The backend generates a JWT token
3. The token is stored in `localStorage`
4. The token is sent in the header:

```txt
Authorization: Bearer <token>
```

---

# Administrator Panel

Administrators have additional capabilities:

- deleting games
- moderating comments
- viewing platform statistics

Access to the panel is secured using middleware:

```js
admin.middleware.js
```

---

# Developer Notes

The project uses:

- `React.StrictMode` to improve code quality
- Google Cloud Storage for storing game files
- `confirm()` prompts for destructive operations

---

# Possible Extensions

Potential future features:

- achievement system
- player rankings
- creator following system
- notifications
- multiplayer support

---

# License

This project is intended for educational and demonstration purposes.
