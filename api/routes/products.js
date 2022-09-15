const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ProductsController = require('../controllers/products');
const checkAuth = require('../middleware/check-auth');

router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, ProductsController.products_create_product);

router.get("/:productName", ProductsController.products_get_product);

router.patch("/:productName", checkAuth, ProductsController.products_update_product);

router.delete("/:productName", checkAuth, ProductsController.products_delete);


module.exports = router;
