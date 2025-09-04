const Order = require("../../model/oder.model");
const systemConfig = require("../../config/system");
//[POST] Them 1 don order
module.exports.postOder = async (req, res) => {
    try {
        const user_id = req.user.id;
        const {
            status,
            userInfo,
            products
        } = req.body;
        if (
            !user_id ||
            !userInfo ||
            !userInfo.fullName ||
            !userInfo.phone ||
            !userInfo.address ||
            !userInfo.toadoa ||
            !Array.isArray(userInfo.toadoa.coordinates) ||
            userInfo.toadoa.coordinates.length !== 2 ||
            !Array.isArray(products) ||
            products.length === 0
            ) {
            return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
            }


        const newOrder = new Order({
            user_id,
            status: status || 'pending',
            userInfo: {
                fullName: userInfo.fullName,
                phone: userInfo.phone,
                address: userInfo.address,
                toadoa: {
                    type: 'Point',
                    coordinates: userInfo.toadoa.coordinates
                }
            },
            toadoaDon: {
                type: 'Point',
                coordinates: [105.854444, 21.028511] // Default store location (Hanoi center)
            },
            products,
            deleted: false
        });

        const savedOrder = await newOrder.save();
        return res.status(201).json({ message: 'Đặt hàng thành công', order: savedOrder });

    } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// [GET] /View orders of a user
module.exports.view = async (req, res) => {
    try {
        const id = req.user.id;
        const records = await Order.find({
            user_id: id,
            deleted: false
        }).sort({ createdAt: -1 });

        res.json({
            code: 200,
            orders: records,
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// [] View 1 don hang chi tiet
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await Order.findOne({
        _id : id,
    })
   res.json({ 
        code : 200,
        order : record,
   }
   )
};


// [PATCH] sửa trạng thái đơn hàng
module.exports.editstatus = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    await Order.updateOne({
        _id : id,

    },{
        status : status,
    })
   res.json({ 
        code : 200,
        message : "Thanh doi thanh cong",
   }
   )
};