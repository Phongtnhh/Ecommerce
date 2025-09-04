const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test categories
    const categoriesResponse = await axios.get('http://localhost:3000/category');
    console.log('Categories:', categoriesResponse.data);
    
    // Test products by category
    const productsResponse = await axios.get('http://localhost:3000/products/quan-ao');
    console.log('Products in quan-ao category:', productsResponse.data);
    
  } catch (error) {
    console.error('API Test Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
