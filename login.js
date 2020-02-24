const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

const app = express();

// Passport config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").MongoURI;

// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo DB connected..."))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.use(cors());
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flas
app.use(flash());

// GLobal Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server runnuing on port ${PORT}`));
