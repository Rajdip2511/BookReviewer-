const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cors = require('cors');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const authenticateToken = require('./middleware/auth.js');

const app = express();

// Enable CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.use("/", genl_routes);
app.use("/customer", authenticateToken, customer_routes);

const PORT = 3000;

app.listen(PORT, () => console.log("Server is running on port " + PORT));
