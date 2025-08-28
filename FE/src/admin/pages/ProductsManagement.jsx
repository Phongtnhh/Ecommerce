import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductsManagement.css';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'iPhone 15 Pro',
          category: 'Điện tử',
          price: 25000000,
          stock: 45,
          status: 'active',
          image: '/api/placeholder/100/100',
          createdAt: '2024-01-10'
        },
        {
          id: 2,
          name: 'Samsung Galaxy S24',
          category: 'Điện tử',
          price: 22000000,
          stock: 0,
          status: 'out_of_stock',
          image: '/api/placeholder/100/100',
          createdAt: '2024-01-08'
        },
        {
          id: 3,
          name: 'Áo thun nam',
          category: 'Thời trang',
          price: 299000,
          stock: 120,
          status: 'active',
          image: '/api/placeholder/100/100',
          createdAt: '2024-01-05'
        },
        {
          id: 4,
          name: 'Máy pha cà phê',
          category: 'Gia dụng',
          price: 1500000,
          stock: 25,
          status: 'inactive',
          image: '/api/placeholder/100/100',
          createdAt: '2024-01-03'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['Tất cả', 'Điện tử', 'Thời trang', 'Gia dụng', 'Sách'];
  const statuses = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang bán' },
    { value: 'inactive', label: 'Ngừng bán' },
    { value: 'out_of_stock', label: 'Hết hàng' }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { text: 'Đang bán', class: 'status-active' },
      inactive: { text: 'Ngừng bán', class: 'status-inactive' },
      out_of_stock: { text: 'Hết hàng', class: 'status-out-of-stock' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || filterCategory === 'Tất cả' || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleStatusChange = (productId, newStatus) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: newStatus } : p
    ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="products-management-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý sản phẩm</h1>
          <p className="page-subtitle">Quản lý toàn bộ sản phẩm trong cửa hàng</p>
        </div>
        <div className="page-actions">
          <Link to="/admin/products/create" className="btn-admin btn-primary">
            ➕ Thêm sản phẩm mới
          </Link>
        </div>
      </div>

      <div className="admin-card">
        {/* Filters */}
        <div className="card-header">
          <div className="filters-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'Tất cả' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card-body">
          <div className="results-info">
            Hiển thị {filteredProducts.length} / {products.length} sản phẩm
          </div>
          
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="product-image"
                        />
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-id">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td className="product-price">
                      {product.price.toLocaleString('vi-VN')}đ
                    </td>
                    <td>
                      <span className={`stock-count ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{getStatusBadge(product.status)}</td>
                    <td>{new Date(product.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/admin/products/${product.id}/edit`}
                          className="btn-admin btn-sm btn-warning"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn-admin btn-sm btn-danger"
                        >
                          🗑️
                        </button>
                        <div className="dropdown">
                          <button className="btn-admin btn-sm btn-outline dropdown-toggle">
                            ⚙️
                          </button>
                          <div className="dropdown-menu">
                            <button 
                              onClick={() => handleStatusChange(product.id, 'active')}
                              className="dropdown-item"
                            >
                              Kích hoạt
                            </button>
                            <button 
                              onClick={() => handleStatusChange(product.id, 'inactive')}
                              className="dropdown-item"
                            >
                              Vô hiệu hóa
                            </button>
                            <button className="dropdown-item">
                              Sao chép
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-data">
              <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;
