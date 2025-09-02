const Product = require("../../model/product.model");

// Helper function to remove Vietnamese accents
const removeAccents = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    if(keyword){
        try {
            // Create regex for both original and accent-removed versions
            const keywordNoAccent = removeAccents(keyword);
            const regex = new RegExp(`${keyword}|${keywordNoAccent}`, "i");

            const products = await Product.find({
                $or: [
                    { title: regex },
                    { description: regex }
                ],
                deleted : false,
                status : "active"
            }).sort({ position: "desc" });

            res.json({
                code : 200,
                products : products,
                keyword : keyword,
                total: products.length
            });
        } catch (error) {
            res.status(500).json({
                code : 500,
                message : "Lỗi khi tìm kiếm",
                error: error.message
            });
        }
    } else {
        res.json({
            code : 400,
            message : "Vui lòng nhập từ khóa tìm kiếm",
            products : [],
            keyword : ""
        });
    }
}
