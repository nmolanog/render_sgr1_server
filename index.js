require('dotenv').config();
const express = require("express");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const passport = require("passport");
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
    origin: process.env.CLIENT_URL,
    credentials: true                 // Important for session-based authentication (cookies)
  }));

// Middleware for parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session configuration
const isProduction = process.env.NODE_ENV === "production";

if(isProduction){
    app.set('trust proxy', 1)
}

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
    cookie: { secure: isProduction } // Set to true if using HTTPS
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
    console.log(`Hi there: Server running on port ${PORT}`);
    console.log(`production state ${isProduction}`);
    console.log(`get process.env.TZ: ${process.env.TZ}`);
    console.log(`cors origin: ${process.env.CLIENT_URL}`);
    console.log('Current Time Zone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
});
