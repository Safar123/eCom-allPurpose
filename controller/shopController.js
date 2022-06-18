const Product = require("../model/productModel");

const checkBuyingDetail = async function (productId, userInput, res) {
    const { price, numberInStock } = await Product.findById(productId);

    if (userInput < 0 || userInput === 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be greater than 0 or atleast 1",
        });
    } else if (!userInput || typeof userInput === "undefined") {
        return res.status(400).json({
            success: false,
            message: "Please provide valid quantity ",
        });
    } else if (userInput > numberInStock) {
        return res.status(400).json({
            success: false,
            message: `We only have ${numberInStock} items left. Please make your order below or equals to that amount only`,
        });
    } else {
        try {
            const newQuantity = numberInStock - userInput;
            const newP = await Product.findByIdAndUpdate(
                productId.id,
                { numberInStock: newQuantity },
                { new: true, runValidators: true }
            );
            console.log(newP);
            const total = price * userInput;

            return res.status(201).json({
                success: true,
                data: {
                    total: total,
                },
            });
        } catch (err) {
            console.log(err);
        }
    }
};

module.exports = checkBuyingDetail;
