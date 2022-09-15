const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id quantity")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            quantity:doc.quantity,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc.name
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    quantity:req.body.quantity,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
//      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          quantity:result.quantity,
            _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result.name
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_get_product = (req, res, next) => {
  const name = req.params.productName;
  Product.find({"name":name})
    .select("name price _id quantity")
    .exec()
    .then(doc => {
      if (doc && doc.length!=0) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided product name "+name });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_product = (req, res, next) => {
  const name = req.params.productName;
  Product.findOneAndUpdate(({"name": name }), { $set: req.body },{new:true})
    .exec()
    .then(result => {
      if (result && result!=null) {
      res.status(200).json({
        message: "Product updated successfully",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + result.name
        }
      });
    }
      else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided product name "+name });
      }
    })
  .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_delete = (req, res, next) => {
  const name = req.params.productName;

  Product.find({"name":name})
    .select("name price _id quantity")
    .exec()
    .then(doc => {

  if (doc  && doc.length!=0 ){
  Product.deleteOne({"name": name })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted successfully",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

 }
 else {
   res
     .status(404)
     .json({ message: "No valid entry found for provided product name "+name });
 }
 })

}
