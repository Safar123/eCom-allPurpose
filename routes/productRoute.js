const express = require("express");
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
    .post(uploadProductImage, resizeProductsImage ,addNewProduct);
router
    .route("/products/:id")
    .patch(updateProduct)
    .delete(removeProduct)
    .post(letsBuyProduct);

module.exports = router;
