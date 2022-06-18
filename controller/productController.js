const Product = require("../model/productModel");
const checkBuyingDetail = require("./shopController");
const catchAsync = require("../utils/catchAsyncError");
const GlobalError = require("../utils/globalError");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(
            new GlobalError("Invalid file type. Please upload image only", 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadProductImage = upload.single("coverImage");

exports.resizeProductsImage = (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `${req.body.name.split(" ")[0]
        }-${Date.now()}-products.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${req.file.filename}`);
    next();
};

exports.allProducts = catchAsync(async (req, res) => {
    const products = await Product.find();

    if (!products || products.length === 0) {
        return res.json({
            message: "No product listed in database",
            success: true,
        });
    }

    res.json({
        numberOfProduct: products.length,
        product: products,
    });
});

//Admin controlled section
exports.addNewProduct = catchAsync(async (req, res) => {
    const newProduct = await Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        coverImage: req.file.filename,
    });
    console.log(req.file.filename);
    res.json({
        success: true,
        product: {
            newProduct,
        },
    });
});

exports.updateProduct = catchAsync(async (req, res) => {
    let updatedProduct = await Product.findById(req.params.id);

    if (!updatedProduct) {
        return res.status(404).json({
            success: false,
            message: "No item found for given ID",
        });
    }
    updatedProduct = await Product.findByIdAndUpdate(
        updatedProduct.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        data: {
            updatedProduct,
        },
    });
});

exports.removeProduct = catchAsync(async (req, res, next) => {
    let deleteProduct = await Product.findById(req.params.id);

    if (!deleteProduct) {
        return res.status(404).json({
            success: false,
            message: "No product found for given ID",
        });
    }
    deleteProduct = await Product.findByIdAndRemove(deleteProduct.id);
    res.status(200).json({
        success: true,
        message: "Product removed successfully",
    });
});

exports.letsBuyProduct = catchAsync(async (req, res) => {
    const buyingRequest = await Product.findById(req.params.id);

    if (!buyingRequest) {
        return res.status(400).json({
            success: false,
            message: "Product doesn\t exist",
        });
    } else {
        try {
            const result = await checkBuyingDetail(
                buyingRequest,
                req.body.quantity,
                res
            );

            if (!result) {
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong !!!!!!!!!!",
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
});
