import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import { ProductService } from '../../services/productService';
import { CartService } from '../../services/cartService';
import { toast } from 'react-toastify';
import './DetailProduct.css';

const DetailProduct = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Default');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const detailFetch = async () => {
      const res = await ProductService.getProductDetail(slug);
      setProduct(res.data.product);
      setLoading(false);
    };
    detailFetch();
  }, [slug]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user === null){
      toast.error("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng!");
      navigate('/auth/login');
      return;
    }
    if (!product?._id) {
      toast.error("Product not found!");
      return;
    }
    if (quantity > product.stock) {
      toast.warning(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }

    try {
      const data = {
        productId: product._id,
        quantity
      };

      const res = await CartService.postCart(data);

      if (res?.code === 200 || res?.success) {
        toast.success("Thêm sản phẩm thành công!");
      } else {
        toast.error("Không thể thêm vào giỏ hàng!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!" + error);
    }
  };

  // Mua ngay
  const handleBuyNow = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user === null){
      toast.error("Vui lòng đăng nhập trước khi mua hàng!");
      navigate('/auth/login');
      return;
    }
    if (!product?._id) {
      toast.error("Product not found!");
      return;
    }
    if (quantity > product.stock) {
      toast.warning(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }

    // Tạo sản phẩm giả lập để gửi đến order page
    const selectedProducts = [{
      product_id: product._id,
      quantity: quantity,
      productInfo: {
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage || 0
      }
    }];

    const totalAmount = product.price * quantity;

    // Navigate to order page
    navigate('/order', {
      state: {
        selectedProducts,
        totalAmount
      }
    });
  };



  const handleWishlist = () => {
    console.log('Added to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="detail-product-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.slug}</span>
        </nav>

        {/* Main Product Section */}
        <div className="product-main-section">
          {/* Left Side - Product Images */}
          <div className="product-images">
            <div className="main-image-container">
              <img 
                src={product.thumbnail || "/default.jpg"} 
                alt={product.title} 
                className="main-image"
              />
              <button className="zoom-btn">🔍</button>
            </div>
            
            <div className="thumbnail-images">
              {(product.images && product.images.length > 0
                ? product.images
                : [product.thumbnail || "/default.jpg"]
              ).map((image, index) => (
                <div key={index} className="thumbnail-item">
                  <img src={image} alt={`${product.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="product-details">
            <div className="sale-badge">Sale Off</div>
            
            <h1 className="product-title">{product.title}</h1>
            
            {/* Rating */}
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="review-count">({product.reviewCount || 0} reviews)</span>
            </div>
            
            {/* Price */}
            <div className="product-price">
              <span className="current-price">${product.price}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
              {product.discountPercentage && (
                <span className="discount-percentage">{product.discountPercentage}% Off</span>
              )}
            </div>
            
            <p className="product-description">{product.description}</p>
            
            {/* Size Selection */}
            <div className="size-selection">
              <label>Size / Weight:</label>
              <div className="size-options">
                {(product.sizes || ["Default"]).map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="purchase-actions">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max="99"
                />
                <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= 99}>+</button>
              </div>
              <div className="add-to-cart-and-buy-now-container">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <span>🛒</span>
                  Thêm Vào Giỏ Hàng
                </button>
                <button className="buy-now-btn" onClick={handleBuyNow}>
                  Mua ngay
                </button>
              </div>
              <div className="action-buttons">
                <button className="wishlist-btn" onClick={handleWishlist}>❤️</button>
                <button className="share-btn" onClick={handleShare}>📤</button>
              </div>
            </div>
            
            {/* Product Metadata */}
            <div className="product-metadata">
              <div className="metadata-item">
                <span className="label">Stock:</span>
                <span className="value">{product.stock} sản phẩm có sẵn</span>
              </div>
              <div className="metadata-item">
                <span className="label">Tags:</span>
                <span className="value">{(product.tags || []).join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button 
              className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-header ${activeTab === 'additional' ? 'active' : ''}`}
              onClick={() => setActiveTab('additional')}
            >
              Additional info
            </button>
            <button 
              className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount || 0})
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'additional' && <div className="additional-content"><p>Additional info...</p></div>}
            {activeTab === 'reviews' && <div className="reviews-content"><p>No reviews yet</p></div>}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h3 className="section-title">Related products</h3>
          <div className="related-products-grid">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="related-product-card">
                  <div className={`product-badge ${relatedProduct.badgeType}`}>{relatedProduct.badge}</div>
                  <div className="related-product-image">
                    <img src={relatedProduct.image} alt={relatedProduct.name} />
                  </div>
                  <div className="related-product-info">
                    <h4 className="related-product-name">{relatedProduct.name}</h4>
                    <div className="related-product-rating">
                      {[...Array(relatedProduct.rating)].map((_, i) => (
                        <span key={i} className="star filled">★</span>
                      ))}
                    </div>
                    <div className="related-product-price">
                      <span className="current-price">${relatedProduct.price}</span>
                      <span className="original-price">${relatedProduct.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm liên quan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
