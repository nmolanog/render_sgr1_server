require('dotenv').config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db"); 
const bcrypt = require("bcryptjs");
const cors = require("cors");
const initializePassport = require("./passportConfig");

// Import routes
const authRoutes = require('./routes/authRoutes');
const genericRoutes = require('./routes/genericRoutes');
const studentRoutes = require('./routes/studentRoutes');
const programRoutes = require('./routes/programRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const commitmenttRoutes = require('./routes/commitmentRoutes');
const appointmenttRoutes = require('./routes/appointmentRoutes');

const app = express();

app.use(cors({
    origin: "https://sgr1test.onrender.com",
    credentials: true  // Important for session-based authentication (cookies)
}));

// Middleware for parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const isProduction = process.env.NODE_ENV === "production";

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction && app.get('trust proxy') === 1, // true only if production and HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Trust the proxy (required for HTTPS in environments like Render)
if (isProduction) {
    app.set('trust proxy', 1); // Trust the first proxy (e.g., Render's load balancer)
}
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

initializePassport(); 

// Routes
app.use('/auth', authRoutes);
app.use('/', genericRoutes);
app.use('/student', studentRoutes);
app.use('/program', programRoutes);
app.use('/enrollment', enrollmentRoutes);
app.use('/commitment', commitmenttRoutes);
app.use('/appointment', appointmenttRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
