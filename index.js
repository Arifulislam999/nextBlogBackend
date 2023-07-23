const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const connectDB = require("./utils/db");
const authRouter = require("./routes/userRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const blogRouter = require("./routes/blogRoute");

const app = express();
app.use(cors({ credentials: true, origin: true, withCredentials: true }));
app.use(cookieParser());
const port = process.env.PORT || 9001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connected database with mongodb
connectDB();

// initial Route
app.get("/", (req, res) => {
  res.status(200).send({ message: "Success GET Request." });
});

app.use("/api/user", authRouter);
app.use("/api/user", blogRouter);

// Error Handler
app.use(errorHandler);
// listen app
app.listen(port, () => {
  console.log(`Your Server is Running http://localhost${port}`);
});
// https://blog.logrocket.com/guide-cookies-next-js/
