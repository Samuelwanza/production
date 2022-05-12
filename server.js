const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require('path');
// CORS config.
const corsOptions = { 
  origin: '*', 
  credentials: true,
  optionSuccessStatus: 200,
}

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 5000;
// get driver connection (from mongodb ATLAS cloud :^))
const dbo = require("./db/conn");

// Passport/Express Sessions for User authentication & authorization.
const session = require('express-session');
const passport = require('passport');
//require('./passport/localStrategy')(passport)

// import routes...
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
// import User model...
const user = require('./models/user')
const seedDB = require('./seeds/seed');
const morgan = require('morgan');

const app = express();
require('./passport/passport')(passport);

//require('./passport')(passport);
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev')) // console logs requests for debugging. (NOTE: has to be right after app...)
app.use(express.json());
app.use(cors(corsOptions));
dbo

// Configure express-sessions middleware
app.use(cookieParser('youmustbearedditor'));
const sessionConfig = session({
  secret: 'youmustbearedditor',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
})
app.use(sessionConfig);
app.use(bodyParser.urlencoded({ extended: false })); // We are parsing URL-encoded data from the body

// Passport
app.use(passport.initialize()); // Middleware to use Passport with Express
app.use(passport.session()); // Needed to use express-session with passport


app.use( (req, res, next) => { // [Debugging]
  console.log('req.session:', req.session);
  console.log('req.user:', req.user); // not working here...
  next();
});

// Routing middleware

app.use('/', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);




// Start listening for requests... 
// callback: try to connect to mongodb atlas db after server starts
//app.use(express.static("public"));
app.get("*", function(req,res){
  res.sendFile(path.join(__dirname + '/public/index.html'));
})
app.listen(port, async () => {
  // No errors, we are good to go!
  console.log(`Server is running on port: ${port}`);
  // await seedDB();
  // console.log(`Seeds planted.`);
});

// const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
// const mongoose = require('mongoose');
// const passport = require('passport');
// const flash = require('connect-flash');
// const session = require('express-session');
// const cors = require("cors");
// const morgan = require('morgan');
// const bodyParser = require('body-parser');
// const corsOptions = { 
//   origin: '*', 
//   credentials: true,
//   optionSuccessStatus: 200,
// }
// const user = require('./models/user')
  
// const postRoutes = require('./routes/posts');
// const userRoutes = require('./routes/users');
// const commentRoutes = require('./routes/comments');

// const app = express();

// // Passport Config
// require('./passport/passport')(passport);

// // DB Config
// const dbo = require("./db/conn");

// // Connect to MongoDB
// dbo

// // EJS
// //app.use(expressLayouts);
// //app.set('view engine', 'ejs');

// // Express body parser
// app.use(morgan('dev'))
// app.use(express.urlencoded({ extended: true }));
// //app.use(bodyParser.urlencoded({ extended: false })); // We are parsing URL-encoded data from the body

// // Express session
// app.use(
//   session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true,
//     cookie: { maxAge: 60 * 60 * 1000 }
//   })
// );

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Connect flash
// app.use(flash());

// // Global variables
// // app.use(function(req, res, next) {
// //   res.locals.success_msg = req.flash('success_msg');
// //   res.locals.error_msg = req.flash('error_msg');
// //   res.locals.error = req.flash('error');
// //   next();
// // });
// app.use(cors(corsOptions));
// app.use( (req, res, next) => {
//   console.log('req.session:', req.session);
//   console.log('req.user:', req.user); // not working here...
//   next();
//   });
  

// // Routes
// //app.use('/', require('./routes/index.js'));
// //app.use('/users', require('./routes/users.js'));

// app.use('/users', require('./routes/users.js'));
// app.use('/posts', require('./routes/posts.js'));
// app.use('/comments', require('./routes/comments.js'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server running on  ${PORT}`));


