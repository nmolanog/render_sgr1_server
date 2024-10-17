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

// CORS configuration
const corsOptions = {
    origin: "https://rendersgr1client-production.up.railway.app", // Allow your client domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
    credentials: true, // Allow cookies and credentials to be sent
    optionsSuccessStatus: 204 // For legacy browser support
};
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

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
        secure: isProduction && app.get('trust proxy') === 1, // Only secure if in production and using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: isProduction ? "None" : "Lax" // 'None' for cross-origin requests in production, 'Lax' otherwise
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

// Error handling middleware to catch server errors and log them
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).send('Something broke!'); // Send a generic error message
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Hi there: Server running on port ${PORT}`);
    console.log(`production state ${isProduction}`);
    console.log(`app.get('trust proxy') ${app.get('trust proxy') === 1}`);
}).setTimeout(5000); // Set timeout to 5 seconds (can be increased if needed)
