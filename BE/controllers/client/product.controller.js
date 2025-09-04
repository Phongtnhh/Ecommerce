const Product = require("../../model/product.model");
const ProductCategory = require("../../model/product-category.model");
const ProductCategoryHelper = require("../../helpers/product-category");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status : "active",
        deleted: "false"
    }).sort({position : "desc"});
     
    const newProducts =  products.map(item => {
        item.priceNew = item.price*((100-item.discountPercentage)/100).toFixed(0);
        return item;
    })

    res.status(200).json({
        code : 200,
        massage : "Lay san pham thanh cong",
        data : {
            newProducts : newProducts,
            layoutProductCategory : req.newProductsCategory
        }
        
    });
}

// [GET] products/detail/:slug
module.exports.detail = async (req, res) => {
    try{
        const find = {
            status : "active",
            deleted: "false",
            slug : req.params.slug
        };
        
        const product = await  Product.findOne(find);
        res.json({
            code : 200,
            massage : "san pham theo danh muc",
            data :{
                product : product,
            }
        });
    }catch(error){
        req.flash("error", "loi truy cap!");
        res.redirect("/products");  
    }
    
}

// [GET] products/:slugCategory
module.exports.category = async (req, res) => {
    try{
        const productCategory = await ProductCategory.findOne({
            slug : req.params.slugCategory,
            deleted: false,
            status : "active"
        });

        if (!productCategory) {
            return res.json({
                code : 404,
                massage : "Không tìm thấy danh mục",
                products : []
            });
        }

        const listSubCategory = await ProductCategoryHelper.getSubCategory(productCategory._id);

        const listSubCategoryId = listSubCategory.map(item => item._id.toString());
        const products = await Product.find({
            product_category_id : {$in : [productCategory._id.toString(), ...listSubCategoryId]},
            deleted : false,
            status: "active"
        }).sort({ position: "desc"});

        res.json({
            code : 200,
            massage : "san pham theo danh muc",
            products : products
        })
    }catch(error){
        console.error("Error in category controller:", error);
        res.json({
            code : 404,
            massage : "loi"
        })
    }

}