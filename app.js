const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require('mongoose');


const app = express();

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const MONGO_DB="mongodb://localhost:27017/RestShop"

mongoose.connect(MONGO_DB,{ useNewUrlParser: true,useUnifiedTopology: true});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

const productRoutes = require('./api/routes/products');
const basketRoutes = require('./api/routes/basket');
const userRoutes = require('./api/routes/user');


 app.use('/products', productRoutes);
 app.use('/basket', basketRoutes);
 app.use("/user", userRoutes);


 app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;
