const mongoose = require("mongoose");

const Basket = require("../models/basket");
const Product = require("../models/product");



exports.basket_get_all = (req, res, next) => {
  Basket.find()
    .select("product quantity _id name")
    .populate("product", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        basket: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/basket/" + doc.name
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.basket_add_product = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const basket = new Basket({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return basket.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product added to basket successfully",
        createdBasket: {
          _id: result._id,
          name:result.name,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/basket/" + result.name
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  });
}

exports.basket_get_order = (req, res, next) => {
  Basket.find({"name":req.params.basketName})
  //  .populate("product")
    .populate("product","name price quantity")
    .exec()
    .then(basket => {
      if (basket && basket.length==0) {
        return res.status(404).json({
          message: "Order named "+req.params.basketName +" not found"
        });
      }
      res.status(200).json({
         basket: basket,
        request: {
          type: "GET",
          url: "http://localhost:3000/basket"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.basket_delete_order = (req, res, next) => {

  Basket.find({"name":req.params.basketName})
  //  .populate("product")
    .exec()
    .then(basket => {
        if (basket && basket.length==0) {
        return res.status(404).json({
          message: "Order named "+req.params.basketName +" not found"
        });
      }
      const basket1  = Basket.findOne({"name":req.params.basketName})
      console.log("dfdg")
    Basket.deleteOne({"name":req.params.basketName})
    .exec()  .then(result => {
      res.status(200).json({
        message: "Basket emptied successfully",
        request: {
          type: "POST",
          url: "http://localhost:3000/basket",
          body: { productId: "ID", quantity: "Number" }
        }
      });
    })

    .catch(err => {
      res.status(500).json({
        error: err
      });
    });

})
}
