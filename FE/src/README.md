# E-Commerce Frontend Structure

## Cấu trúc thư mục

```
src/
├── client/                 # Client-side (Khách hàng)
│   ├── components/         # Components riêng cho client
│   ├── pages/             # Các trang client
│   │   ├── Home.jsx       # Trang chủ
│   │   ├── Products.jsx   # Danh sách sản phẩm
│   │   ├── Login.jsx      # Đăng nhập
│   │   └── index.js       # Export pages
│   ├── layouts/           # Layout cho client
│   │   ├── ClientLayout.jsx  # Layout chính
│   │   ├── Header.jsx     # Header
│   │   ├── Footer.jsx     # Footer
│   │   └── *.css          # CSS files
│   ├── services/          # API services cho client
│   │   ├── productService.js
│   │   └── categoryService.js
│   ├── hooks/             # Custom hooks cho client
│   └── styles/            # Styles riêng cho client
│
├── admin/                 # Admin panel
│   ├── components/        # Components riêng cho admin
│   ├── pages/            # Các trang admin
│   │   ├── Dashboard.jsx  # Dashboard chính
│   │   ├── ProductsManagement.jsx  # Quản lý sản phẩm
│   │   └── index.js       # Export pages
│   ├── layouts/          # Layout cho admin
│   │   ├── AdminLayout.jsx   # Layout chính admin
│   │   ├── Sidebar.jsx    # Sidebar navigation
│   │   ├── AdminHeader.jsx # Header admin
│   │   └── *.css          # CSS files
│   ├── services/         # API services cho admin
│   │   ├── adminProductService.js
│   │   └── adminOrderService.js
│   ├── hooks/            # Custom hooks cho admin
│   └── styles/           # Styles riêng cho admin
│
├── shared/               # Shared resources
│   ├── components/       # Shared components
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   └── index.js
│   ├── hooks/           # Shared custom hooks
│   ├── utils/           # Utility functions
│   ├── constants/       # Constants và config
│   │   └── index.js     # API endpoints, status, etc.
│   └── services/        # Shared services
│       └── api.js       # Base API configuration
│
├── routes/              # Routing configuration
│   ├── clientRoutes.jsx # Routes cho client
│   └── adminRoutes.jsx  # Routes cho admin
│
├── assets/              # Static assets
├── App.jsx              # Main App component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Tính năng đã implement

### Client Side
- ✅ Layout cơ bản (Header, Footer, Main Layout)
- ✅ Trang Home với hero section, categories, featured products
- ✅ Trang Products với filters và search
- ✅ Trang Login với form validation
- ✅ Responsive design cho mobile

### Admin Side
- ✅ Dashboard layout với sidebar navigation
- ✅ Dashboard với statistics cards
- ✅ Products Management với table view
- ✅ Responsive admin interface

### Shared
- ✅ API service với axios interceptors
- ✅ Constants và configurations
- ✅ Shared components (LoadingSpinner, Modal)
- ✅ Routing system

## Các trang cần phát triển tiếp

### Client
- Product Detail Page
- Cart Page
- Checkout Page
- Register Page
- User Profile Page
- Orders History Page
- Wishlist Page
- Categories Page
- About Page
- Contact Page

### Admin
- Create/Edit Product Pages
- Orders Management
- Customers Management
- Categories Management
- Reports Pages
- Settings Pages
- Admin Profile Page

## API Integration

Các service đã được tạo sẵn để kết nối với backend APIs:

### Client Services
- `productService.js` - Quản lý sản phẩm
- `categoryService.js` - Quản lý danh mục

### Admin Services
- `adminProductService.js` - Quản lý sản phẩm (admin)
- `adminOrderService.js` - Quản lý đơn hàng (admin)

### Shared Services
- `api.js` - Base API configuration với interceptors

## Cách sử dụng

1. Import components từ các thư mục tương ứng
2. Sử dụng services để gọi APIs
3. Sử dụng constants để đảm bảo consistency
4. Thêm các pages mới vào routes tương ứng

## Lưu ý

- Tất cả các trang "Coming Soon" cần được implement
- CSS đã được tối ưu cho responsive design
- API services đã có error handling cơ bản
- Authentication flow cần được hoàn thiện
- State management có thể cần Redux/Context API cho complex state
