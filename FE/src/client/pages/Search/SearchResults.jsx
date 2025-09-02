import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SearchService } from '../../services/searchService';
import { toast } from 'react-toastify';
import './SearchResults.css';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchKeyword = searchParams.get('keyword');
    
    if (searchKeyword) {
      setKeyword(searchKeyword);
      fetchSearchResults(searchKeyword);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const fetchSearchResults = async (searchKeyword) => {
    try {
      setLoading(true);
      const response = await SearchService.searchProducts(searchKeyword);
      
      if (response?.code === 200) {
        setProducts(response.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="search-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tìm kiếm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Kết quả tìm kiếm</h1>
          {keyword && (
            <p className="search-info">
              Tìm thấy <strong>{products.length}</strong> sản phẩm cho từ khóa "<strong>{keyword}</strong>"
            </p>
          )}
        </div>

        {products.length > 0 ? (
          <div className="search-results">
            <div className="products-grid">
              {products.map(product => (
                <Link
                  to={`/products/detail/${product.slug}`}
                  key={product._id}
                  className="product-card"
                >
                  <div className="product-image">
                    <img src={product.thumbnail} alt={product.title} />
                    {product.discountPercentage > 0 && (
                      <div className="discount-badge">
                        -{product.discountPercentage}%
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <div className="product-price">
                      <span className="current-price">
                        ₫{product.price?.toLocaleString()}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="original-price">
                          ₫{(product.price / (1 - product.discountPercentage / 100))?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="product-rating">
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                      <span className="rating-text">(4.0)</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <div className="no-results-icon">🔍</div>
              <h2>Không tìm thấy sản phẩm</h2>
              <p>
                {keyword 
                  ? `Không có sản phẩm nào phù hợp với từ khóa "${keyword}"`
                  : 'Vui lòng nhập từ khóa để tìm kiếm'
                }
              </p>
              <div className="search-suggestions-text">
                <p>Gợi ý:</p>
                <ul>
                  <li>Kiểm tra lại chính tả</li>
                  <li>Thử sử dụng từ khóa khác</li>
                  <li>Sử dụng từ khóa tổng quát hơn</li>
                </ul>
              </div>
              <Link to="/products" className="browse-all-btn">
                Xem tất cả sản phẩm
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
