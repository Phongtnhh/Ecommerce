import React from 'react';
import ClientLayout from '../client/layouts/ClientLayout';
import Home from '../client/pages/Home/Home';
import Register from '../client/pages/Register/Register';
import Products from '../client/pages/Products/Product';
import Login from '../client/pages/Login/Login';
import AuthLayout from '../client/layouts/authLayout/AuthLayout';
import DetailProduct from '../client/pages/DetailProduct/detailProduct';
import ProductbyCategory from '../client/pages/ProductbyCategory/ProductbyCategory';
import Profile from '../client/pages/Profile/Profile';
import Cart from '../client/pages/Cart/Cart';
import Order from '../client/pages/Order/Order';
import SearchResults from '../client/pages/Search/SearchResults';
const clientRoutes = [
    {   
    path: "/",
    element: <ClientLayout />,
    children: [
        {
            index: true,
            element: <Home />
        },
        {
            path: "products",
            element: <Products />
        },
        {
            path: "/products/detail/:slug",
            element: <DetailProduct />
        },
        {
            path: "products/:slugCategory",
            element: <ProductbyCategory />
        },
        {
            path: "categories/:id",
            element: <div>Category Products Page - Coming Soon</div>
        },
        {
            path: "cart",
            element: <Cart />
        },
        {
            path: "order",
            element: <Order />
        },
        {
            path: "search",
            element: <SearchResults />
        },
        {
            path: "checkout",
            element: <div>Checkout Page - Coming Soon</div>
        },
        {
            path: "profile",
            element: <Profile />
        },
        {
            path: "orders",
            element: <div>Orders Page - Coming Soon</div>
        },
        {
            path: "wishlist",
            element: <div>Wishlist Page - Coming Soon</div>
        },
        {
            path: "about",
            element: <div>About Page - Coming Soon</div>
        },
        {
            path: "contact",
            element: <div>Contact Page - Coming Soon</div>
        }
   ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  }
];

export default clientRoutes;