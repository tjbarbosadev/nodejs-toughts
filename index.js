// Import required modules
const express = require('express'); // Express framework
const exphbs = require('express-handlebars'); // Handlebars template engine
const session = require('express-session'); // Session middleware
const FileStore = require('session-file-store')(session); // File-based session store
const flash = require('express-flash'); // Flash messages for one-time notifications

// Initialize Express application
const app = express();
// Database connection
const conn = require('./db/conn');

// Configure Handlebars as the view engine
app.engine('handlebars', exphbs.engine()); // Set up Handlebars engine
app.set('view engine', 'handlebars'); // Set Handlebars as the default view engine

// Middleware to parse URL-encoded form data
app.use(
  express.urlencoded({
    extended: true, // Allows parsing of nested objects
  })
);

// Middleware to parse JSON data
app.use(express.json()); // Note: Fixed missing parentheses here

// Configure session middleware
app.use(
  session({
    name: 'session', // Name of the session ID cookie
    secret: 'nosso_secret', // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    store: new FileStore({
      // File-based session store configuration
      logFn: function () {}, // Disable logging
      path: require('path').join(require('os').tmpdir(), 'sessions'), // Store sessions in OS temp directory
    }),
    cookie: {
      // Cookie settings
      secure: false, // Set to true if using HTTPS
      maxAge: 360000, // Session duration in milliseconds (6 minutes)
      expires: new Date(Date.now() + 360000), // Expiration date
      httpOnly: true, // Prevent client-side JS from accessing the cookie
    },
  })
);

// Flash messages middleware (must be after session middleware)
app.use(flash());

// Serve static files from 'public' directory
app.use(express.static('public'));

// Custom middleware to make session data available in views
app.use((req, res, next) => {
  if (req.session.userid) {
    // If user is logged in (has userid in session)
    res.locals.session = req.session; // Make session data available in all views
  }
  next(); // Continue to next middleware/route
});

// Database synchronization and server startup
conn
  // .sync({ force: true }) // Uncomment to force database recreation (drops existing tables)
  .sync() // Normal synchronization (creates tables if they don't exist)
  .then(() => {
    // Start the server after successful database sync
    app.listen(3000, () => {
      console.log('Connected on port 3000'); // Fixed typo in message
    });
  })
  .catch(console.log); // Log any errors that occur during sync
