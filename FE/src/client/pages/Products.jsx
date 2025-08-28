import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'name'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'iPhone 15 Pro', price: 25000000, category: 'Điện tử', image: '/api/placeholder/300/300', rating: 4.8, inStock: true },
        { id: 2, name: 'Samsung Galaxy S24', price: 22000000, category: 'Điện tử', image: '/api/placeholder/300/300', rating: 4.6, inStock: true },
        { id: 3, name: 'Áo thun nam', price: 299000, category: 'Thời trang', image: '/api/placeholder/300/300', rating: 4.2, inStock: true },
        { id: 4, name: 'Quần jeans nữ', price: 599000, category: 'Thời trang', image: '/api/placeholder/300/300', rating: 4.5, inStock: false },
        { id: 5, name: 'Máy pha cà phê', price: 1500000, category: 'Gia dụng', image: '/api/placeholder/300/300', rating: 4.7, inStock: true },
        { id: 6, name: 'Sách lập trình', price: 150000, category: 'Sách', image: '/api/placeholder/300/300', rating: 4.9, inStock: true }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['Tất cả', 'Điện tử', 'Thời trang', 'Gia dụng', 'Sách'];
  const priceRanges = [
    { label: 'Tất cả', value: '' },
    { label: 'Dưới 500.000đ', value: '0-500000' },
    { label: '500.000đ - 1.000.000đ', value: '500000-1000000' },
    { label: '1.000.000đ - 5.000.000đ', value: '1000000-5000000' },
    { label: 'Trên 5.000.000đ', value: '5000000-999999999' }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category && filters.category !== 'Tất cả' && product.category !== filters.category) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-subtitle">Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi</p>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Tìm kiếm</h3>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-section">
              <h3>Danh mục</h3>
              <div className="filter-options">
                {categories.map(category => (
                  <label key={category} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category === 'Tất cả' ? '' : category}
                      checked={filters.category === (category === 'Tất cả' ? '' : category)}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Khoảng giá</h3>
              <div className="filter-options">
                {priceRanges.map(range => (
                  <label key={range.value} className="filter-option">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="results-info">
                Hiển thị {filteredProducts.length} sản phẩm
              </div>
              <div className="sort-options">
                <label>Sắp xếp theo:</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Tên A-Z</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {!product.inStock && <div className="out-of-stock-badge">Hết hàng</div>}
                    <div className="product-overlay">
                      <button className="quick-view-btn">Xem nhanh</button>
                      <button className="wishlist-btn">❤️</button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                      <span className="rating-text">({product.rating})</span>
                    </div>
                    <div className="product-price">
                      {product.price.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="product-actions">
                      <button 
                        className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                      </button>
                      <Link to={`/products/${product.id}`} className="view-detail-btn">
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
