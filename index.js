require('dotenv').config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db"); 
const bcrypt = require("bcryptjs");
const cors= require("cors");
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
    credentials: true
  }));

// Middleware for parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true, // Use secure cookies in production
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        sameSite: 'None'
     } // Set to true if using HTTPS
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

initializePassport(); 

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
