# Study App Backend

Node.js + Express + MongoDB + JWT + Socket.IO backend, built following this roadmap:

1. Backend folder
2. Node.js project init
3. Express install
4. Backend folder structure
5. MongoDB connect
6. User Model
7. Register API
8. Login API + JWT
9. Notes API
10. Tasks API
11. Study Planner API
12. Groups API
13. Socket.IO Chat
14. Frontend + Backend connect (CORS)

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your real MongoDB URI + JWT secret
npm run dev             # nodemon (development)
npm start                # production
```

Make sure MongoDB is running locally, or put an Atlas connection string in `MONGO_URI`.

## Folder Structure

```
backend/
 ├── config/db.js              # MongoDB connection
 ├── models/                   # Mongoose schemas
 │   ├── User.js
 │   ├── Note.js
 │   ├── Task.js
 │   ├── StudyPlan.js
 │   ├── Group.js
 │   └── Message.js
 ├── controllers/               # Route logic
 ├── routes/                    # Express routers
 ├── middleware/authMiddleware.js  # JWT protect middleware
 ├── socket/chatSocket.js       # Socket.IO real-time chat
 ├── utils/generateToken.js
 └── server.js                  # App entry point
```

## API Endpoints

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login, returns JWT |
| GET | /api/auth/me | Private | Get logged-in user |

### Notes
| Method | Route | Access |
|---|---|---|
| GET | /api/notes | Private |
| POST | /api/notes | Private |
| GET | /api/notes/:id | Private |
| PUT | /api/notes/:id | Private |
| DELETE | /api/notes/:id | Private |

### Tasks
| Method | Route | Access |
|---|---|---|
| GET | /api/tasks | Private |
| POST | /api/tasks | Private |
| PUT | /api/tasks/:id | Private |
| DELETE | /api/tasks/:id | Private |

### Study Planner
| Method | Route | Access |
|---|---|---|
| GET | /api/study-planner | Private |
| POST | /api/study-planner | Private |
| PUT | /api/study-planner/:id | Private |
| DELETE | /api/study-planner/:id | Private |

### Groups
| Method | Route | Access |
|---|---|---|
| GET | /api/groups | Private |
| POST | /api/groups | Private |
| POST | /api/groups/:id/join | Private |
| POST | /api/groups/:id/leave | Private |
| DELETE | /api/groups/:id | Private (admin only) |

### Messages (chat history)
| Method | Route | Access |
|---|---|---|
| GET | /api/messages/:groupId | Private |

## Auth Usage

All private routes require header:
```
Authorization: Bearer <token>
```

## Socket.IO Chat (frontend usage example)

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

socket.emit("joinGroup", groupId);

socket.emit("sendMessage", { groupId, text: "Hello!" });

socket.on("newMessage", (message) => {
  console.log(message);
});

socket.on("userTyping", ({ userName }) => {
  console.log(`${userName} is typing...`);
});
```

## Connecting Frontend (Step 14)

- Set `CLIENT_URL` in `.env` to your frontend's URL (e.g. `http://localhost:3000`) — this is already wired into CORS for both Express and Socket.IO.
- From frontend, call REST APIs with `fetch`/`axios` using base URL `http://localhost:5000/api/...` and attach the JWT token to the `Authorization` header for private routes.
