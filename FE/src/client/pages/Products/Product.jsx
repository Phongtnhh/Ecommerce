import React, { useState, useEffect } from 'react';
import { Link, useLocation  } from 'react-router-dom';
import { ProductService } from '../../services/productService';
import { CategoryService } from '../../services/categoryService';
import './Product.css';

const Product = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 2000 },
    colors: [],
    // condition: []
  });
   const [viewMode, setViewMode] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(6); // 👈 mặc định 10 sản phẩm/trang
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          ProductService.getProducts(),
          CategoryService.getCategory()
        ]);
        
        setProducts(productsData.data.newProducts || []);
        setCategories(categoriesData.data.Category || []);
        
        // Get new products (first 3 products for demo)
        setNewProducts(productsData.data.newProducts?.slice(0, 3) || []);
        setCurrentCategory(categoriesData.data.Category.filter(cat => cat.parent_id === "") || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.title : 'Unknown';
  };

  // Handle price range change
  const handlePriceRangeChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const location = useLocation();

  // Lấy query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");

    if (categoryFromUrl) {
      setFilters(prev => ({
        ...prev,
        category: categoryFromUrl
      }));
    }
  }, [location.search]);

  // Handle color filter
  const handleColorFilter = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };
  // Apply filters
  const filteredProducts = products.filter(product => {
    // Price range filter
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
      return false;
    }
    return true;
  });

  
  // Calculate discounted price
  const getDiscountedPrice = (price, discountPercentage) => {
    if (!discountPercentage) return price;
    return price - (price * discountPercentage / 100);
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
  const priceA = getDiscountedPrice(a.price, a.discountPercentage);
  const priceB = getDiscountedPrice(b.price, b.discountPercentage);

  switch (sortBy) {
    case 'price-low':
      return priceA - priceB;
    case 'price-high':
      return priceB - priceA;
    case 'rating':
      return (b.rating || 0) - (a.rating || 0);
    case 'newest':
      return new Date(b.createdAt) - new Date(a.createdAt);
    default:
      return 0;
  }
});



  // Get product badge
  const getProductBadge = (product) => {
    if (product.discountPercentage >= 20) return { text: `-${product.discountPercentage}%`, type: 'discount' };
    if (product.position <= 3) return { text: 'Hot', type: 'hot' };
    if (product.position <= 6) return { text: 'Sale', type: 'sale' };
    if (product.position <= 9) return { text: 'New', type: 'new' };
    return null;
  };
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll lên đầu khi đổi trang
  };
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Sản Phẩm</h1>
          
          {/* Filter Tags */}
          <div className="filter-tags">
            <div className="filter-tag">
              <span>Cabbage</span>
              <button className="remove-tag">×</button>
            </div>
            <div className="filter-tag">
              <span>Broccoli</span>
              <button className="remove-tag">×</button>
            </div>
            <div className="filter-tag">
              <span>Artichoke</span>
              <button className="remove-tag">×</button>
            </div>
            <div className="filter-tag">
              <span>Celery</span>
              <button className="remove-tag">×</button>
            </div>
            <div className="filter-tag">
              <span>Spinach</span>
              <button className="remove-tag">×</button>
            </div>
          </div>
        </div>

        <div className="product-layout">
          {/* Left Sidebar */}
          <aside className="product-sidebar">
            {/* Category Section */}
            <div className="sidebar-section">
              <h3 className="section-title">Danh mục</h3>
              <div className="category-list">
                {currentCategory.map(category => (
                  <div key={category._id} className="category-item">
                    <div className="category-icon">
                      <span className="icon-placeholder">🥛</span>
                    </div>
                    <Link to={`/products/${category.slug}`} className="category-info" >
                      <span className="category-name">{category.title}</span>
                      <span className="category-count">({category.productCount || 0} items)</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter Section */}
            <div className="sidebar-section">
              <h3 className="section-title">Fill by price</h3>
              <div className="price-filter">
                <div className="price-range">
                  <span>From: ${filters.priceRange.min}</span>
                  <span>To: ${filters.priceRange.max}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange(filters.priceRange.min, parseInt(e.target.value))}
                  className="price-slider"
                />
              </div>

              {/* Color Filters */}
              <div className="filter-group">
                <h4>Color</h4>
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes('red')}
                      onChange={() => handleColorFilter('red')}
                    />
                    <span>Red (56)</span>
                  </label>
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes('green')}
                      onChange={() => handleColorFilter('green')}
                    />
                    <span>Green (78)</span>
                  </label>
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes('blue')}
                      onChange={() => handleColorFilter('blue')}
                    />
                    <span>Blue (54)</span>
                  </label>
                </div>
              </div>
              <button className="filter-btn">
                <span className="filter-icon">🔍</span>
                Filter
              </button> 
            </div>

            {/* New Products Section */}
            <div className="sidebar-section">
              <h3 className="section-title">New products</h3>
              <div className="new-products-list">
                {newProducts.map(product => (
                  <div key={product._id} className="new-product-item">
                    <div className="new-product-image">
                      <img src={product.thumbnail} alt={product.title} />
                    </div>
                    <div className="new-product-info">
                      <h4 className="new-product-name">{product.title}</h4>
                      <div className="new-product-price">${product.price}</div>
                      <div className="new-product-rating">⭐</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="product-main">
            {/* Toolbar */}
            <div className="product-toolbar">
              <div className="results-info">
                We found {sortedProducts.length} items for you!
              </div>
              <div className="toolbar-controls">
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <span className="grid-icon">⊞</span>
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <span className="list-icon">☰</span>
                  </button>
                </div>
                
                <div className="items-per-page">
                  <label>Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                
                <div className="sort-by">
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {paginatedProducts.map(product => {
                const badge = getProductBadge(product);
                const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
                const categoryName = getCategoryName(product.product_category_id);
                
                return (
                  <Link to ={`/products/detail/${product.slug}`} key={product._id} className="product-card">
                    {badge && (
                      <div className={`product-badge ${badge.type}`}>
                        {badge.text}
                      </div>
                    )}
                    
                    <div className="product-image">
                      <img src={product.thumbnail} alt={product.title} />
                    </div>
                    
                    <div className="product-info">
                      <div className="product-category">{categoryName.toUpperCase()}</div>
                      <h3 className="product-name">{product.title}</h3>
                      <div className="product-rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="rating-text">(4.0)</span>
                      </div>
                      <div className="product-brand">By NestFood</div>
                      <div className="product-price">
                        <span className="current-price">${discountedPrice}</span>
                        {product.discountPercentage > 0 && (
                          <span className="old-price">${product.price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {sortedProducts.length === 0 && (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
              </div>
            )}
             {/* Pagination controls 👇 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                 »
              </button>
            </div>
          )}
          </main>
        </div>

        {/* Scroll to Top Button */}
        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="arrow-up">↑</span>
        </button>
      </div>
    </div>
  );
};

export default Product;
