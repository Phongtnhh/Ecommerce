
const ProductCategory = require("../../model/product-category.model");
// [GET] category
module.exports.index = async (req, res) => {
    let find = {
        deleted : false,
    };
    const productCategory = await ProductCategory.find(find);
    res.status(200).json({
        code: 200,
        message: "Lấy danh sách sản phẩm thành công",
        data: {
            Category: productCategory
        }
    });

}  


// [GET] category/:id 
module.exports.getCategoryname = async (req, res) => {
    const category = await ProductCategory.findById(req.params.id);
    res.status(200).json({
        code: 200,
        message: "Lấy danh sách sản phẩm thành công",
        data: {
            Category: category
        }
    });
}