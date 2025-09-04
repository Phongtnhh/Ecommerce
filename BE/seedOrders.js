const mongoose = require('mongoose');
const Order = require('./model/oder.model');

async function seedOrders() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Xóa đơn hàng cũ
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Tạo đơn hàng mẫu
    const sampleOrders = [
      {
        user_id: "test_user_1",
        status: "shipping",
        userInfo: {
          fullName: "Nguyễn Văn A",
          phone: "0123456789",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          toadoa: {
            type: "Point",
            coordinates: [105.860000, 21.030000] // Customer location
          }
        },
        toadoaDon: {
          type: "Point",
          coordinates: [105.854444, 21.028511] // Store location
        },
        products: [
          {
            product_id: "test123",
            title: "Xiami 123",
            thumbnail: "https://via.placeholder.com/300x300?text=Xiami+123",
            price: 299000,
            discountPercentage: 10,
            quantity: 2
          },
          {
            product_id: "test456",
            title: "Áo sơ mi nam",
            thumbnail: "https://via.placeholder.com/300x300?text=Ao+So+Mi",
            price: 450000,
            discountPercentage: 15,
            quantity: 1
          }
        ],
        deleted: false
      },
      {
        user_id: "test_user_1",
        status: "delivered",
        userInfo: {
          fullName: "Nguyễn Văn A",
          phone: "0123456789",
          address: "456 Đường XYZ, Quận 2, TP.HCM",
          toadoa: {
            type: "Point",
            coordinates: [105.870000, 21.040000]
          }
        },
        toadoaDon: {
          type: "Point",
          coordinates: [105.854444, 21.028511]
        },
        products: [
          {
            product_id: "test789",
            title: "Quần jean nam",
            thumbnail: "https://via.placeholder.com/300x300?text=Quan+Jean",
            price: 650000,
            discountPercentage: 20,
            quantity: 1
          }
        ],
        deleted: false
      },
      {
        user_id: "test_user_1",
        status: "pending",
        userInfo: {
          fullName: "Nguyễn Văn A",
          phone: "0123456789",
          address: "789 Đường DEF, Quận 3, TP.HCM",
          toadoa: {
            type: "Point",
            coordinates: [105.850000, 21.020000]
          }
        },
        toadoaDon: {
          type: "Point",
          coordinates: [105.854444, 21.028511]
        },
        products: [
          {
            product_id: "test101",
            title: "iPhone 15",
            thumbnail: "https://via.placeholder.com/300x300?text=iPhone+15",
            price: 25000000,
            discountPercentage: 5,
            quantity: 1
          }
        ],
        deleted: false
      },
      {
        user_id: "test_user_1",
        status: "confirmed",
        userInfo: {
          fullName: "Nguyễn Văn A",
          phone: "0123456789",
          address: "321 Đường GHI, Quận 4, TP.HCM",
          toadoa: {
            type: "Point",
            coordinates: [105.845000, 21.035000]
          }
        },
        toadoaDon: {
          type: "Point",
          coordinates: [105.854444, 21.028511]
        },
        products: [
          {
            product_id: "test202",
            title: "Samsung Galaxy S24",
            thumbnail: "https://via.placeholder.com/300x300?text=Galaxy+S24",
            price: 22000000,
            discountPercentage: 8,
            quantity: 1
          }
        ],
        deleted: false
      }
    ];

    // Tạo đơn hàng từng cái một
    const createdOrders = [];
    for (const orderData of sampleOrders) {
      const order = new Order(orderData);
      const savedOrder = await order.save();
      createdOrders.push(savedOrder);
    }

    console.log('Created orders:', createdOrders.length);
    console.log('\nSeeded orders successfully!');
    
    createdOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order ${order._id} - Status: ${order.status} - Products: ${order.products.length}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders();
