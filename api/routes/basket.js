const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const BasketController = require('../controllers/basket');



router.get("/", checkAuth, BasketController.basket_get_all);

router.post("/", checkAuth, BasketController.basket_add_product);

router.get("/:basketName", checkAuth, BasketController.basket_get_order);

router.delete("/:basketName", checkAuth, BasketController.basket_delete_order);

module.exports = router;
