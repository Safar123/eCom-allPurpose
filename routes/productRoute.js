const express = require("express");
const { routeProtector } = require("../controller/authController");
const {
    allProducts,
    addNewProduct,
    updateProduct,
    removeProduct,
    letsBuyProduct,
    uploadProductImage,
    resizeProductsImage,
} = require("../controller/productController");

const router = express.Router();

router
    .route("/products")
    .get(allProducts)
    .post(routeProtector, uploadProductImage, resizeProductsImage ,addNewProduct);
router
    .route("/products/:id")
    .patch(updateProduct)
    .delete(removeProduct)
    .post(letsBuyProduct);

module.exports = router;
