const mongoose = require('mongoose');
const Product = require('./model/product.model');
const ProductCategory = require('./model/product-category.model');

async function seedData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/e-web');
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await ProductCategory.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Tạo danh mục từng cái một để tránh lỗi slug
    const clothingCategory = new ProductCategory({
      title: 'Quần áo',
      description: 'Thời trang nam nữ',
      status: 'active',
      position: 1,
      deleted: false
    });
    await clothingCategory.save();

    const electronicsCategory = new ProductCategory({
      title: 'Điện tử',
      description: 'Thiết bị điện tử',
      status: 'active',
      position: 2,
      deleted: false
    });
    await electronicsCategory.save();

    const householdCategory = new ProductCategory({
      title: 'Gia dụng',
      description: 'Đồ gia dụng',
      status: 'active',
      position: 3,
      deleted: false
    });
    await householdCategory.save();

    const createdCategories = [clothingCategory, electronicsCategory, householdCategory];
    console.log('Created categories:', createdCategories.length);

    // Tạo sản phẩm từng cái một
    const clothingCategoryId = createdCategories.find(cat => cat.title === 'Quần áo')._id;
    const electronicsCategoryId = createdCategories.find(cat => cat.title === 'Điện tử')._id;

    const product1 = new Product({
      title: 'Xiami 123',
      description: 'Áo thun xiami chất lượng cao',
      product_category_id: clothingCategoryId.toString(),
      price: 299000,
      discountPercentage: 10,
      stock: 50,
      thumbnail: 'https://via.placeholder.com/300x300?text=Xiami+123',
      status: 'active',
      position: 1,
      deleted: false
    });
    await product1.save();

    const product2 = new Product({
      title: 'Áo sơ mi nam',
      description: 'Áo sơ mi công sở',
      product_category_id: clothingCategoryId.toString(),
      price: 450000,
      discountPercentage: 15,
      stock: 30,
      thumbnail: 'https://via.placeholder.com/300x300?text=Ao+So+Mi',
      status: 'active',
      position: 2,
      deleted: false
    });
    await product2.save();

    const product3 = new Product({
      title: 'Quần jean nam',
      description: 'Quần jean thời trang',
      product_category_id: clothingCategoryId.toString(),
      price: 650000,
      discountPercentage: 20,
      stock: 25,
      thumbnail: 'https://via.placeholder.com/300x300?text=Quan+Jean',
      status: 'active',
      position: 3,
      deleted: false
    });
    await product3.save();

    const product4 = new Product({
      title: 'iPhone 15',
      description: 'Điện thoại iPhone mới nhất',
      product_category_id: electronicsCategoryId.toString(),
      price: 25000000,
      discountPercentage: 5,
      stock: 10,
      thumbnail: 'https://via.placeholder.com/300x300?text=iPhone+15',
      status: 'active',
      position: 4,
      deleted: false
    });
    await product4.save();

    const product5 = new Product({
      title: 'Samsung Galaxy S24',
      description: 'Điện thoại Samsung cao cấp',
      product_category_id: electronicsCategoryId.toString(),
      price: 22000000,
      discountPercentage: 8,
      stock: 15,
      thumbnail: 'https://via.placeholder.com/300x300?text=Galaxy+S24',
      status: 'active',
      position: 5,
      deleted: false
    });
    await product5.save();

    const createdProducts = [product1, product2, product3, product4, product5];
    console.log('Created products:', createdProducts.length);

    console.log('\nSeeded data successfully!');
    console.log('Categories:');
    createdCategories.forEach(cat => console.log(`- ${cat.title} (${cat._id})`));
    console.log('\nProducts:');
    createdProducts.forEach(p => console.log(`- ${p.title} (Category: ${p.product_category_id})`));

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
