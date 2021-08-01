const path = require('path');

const express = require("express");
const dotEnv = require("dotenv");
const fileUpload = require('express-fileupload');

const connectDb = require('./config/db')
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
const {errorHandler} = require('./middlewares/errors');
const { setHeaders } = require('./middlewares/headers');

const app = express();

//* Database Config
connectDb()

//* dotEnv Config
dotEnv.config({ path: "./config/config.env" });


//* BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(setHeaders)

//* Express-FileUpload
app.use(fileUpload())


//* Static
app.use(express.static(path.join(__dirname, "public")));

//* Routes
app.use(indexRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', require('./routes/dashboard'));


//* Error Controller
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server is running in mode ${process.env.NODE_ENV} on Port: ${PORT}`
  )
);
