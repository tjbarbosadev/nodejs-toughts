// Import required modules
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

// Initialize Express
const app = express();
const conn = require('./db/conn');

// Models
const Tought = require('./models/Tought');
const User = require('./models/User');

// Routes
const { toughtsRoutes } = require('./routes/toughtsRoutes');
const { authRoutes } = require('./routes/authRoutes');

// Controllers
const ToughtController = require('./controllers/ToughtsController');

// Handlebars config
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session config
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      httpOnly: true,
    },
  })
);

app.use(flash());
app.use(express.static('public'));

// Set session to res.locals
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

// Routes
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);
app.get('/', ToughtController.showToughts);

// Start server
conn
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((err) => {
    console.log('Connection error:', err);
  });
