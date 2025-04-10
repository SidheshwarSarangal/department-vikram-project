const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const routes = require("./api/routes/index");

// 📌 Set body size limit BEFORE anything else that uses body data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// 📦 Logging
app.use(morgan("dev"));

// 🔌 DB Connection
require("./db_connection");

// 🌍 CORS Config
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 🍪 Session & Cookies
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, priority: "High" }
  })
);
app.use(cookieParser(process.env.SECRET));

// 🔐 Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passportConfig")(passport);

// 🛣 Routes
app.use(routes);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server Is Connected to Port " + PORT);
});
