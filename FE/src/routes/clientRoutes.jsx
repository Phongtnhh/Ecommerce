import React from 'react';
import ClientLayout from '../client/layouts/ClientLayout';
import Home from '../client/pages/Home/Home';
import Register from '../client/pages/Register/Register';
import Products from '../client/pages/Products';
import Login from '../client/pages/Login/Login';
import AuthLayout from '../client/layouts/authLayout/AuthLayout';
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
            path: "products/:id",
            element: <div>Product Detail Page - Coming Soon</div>
        },
        {
            path: "categories",
            element: <div>Categories Page - Coming Soon</div>
        },
        {
            path: "categories/:id",
            element: <div>Category Products Page - Coming Soon</div>
        },
        {
            path: "cart",
            element: <div>Cart Page - Coming Soon</div>
        },
        {
            path: "checkout",
            element: <div>Checkout Page - Coming Soon</div>
        },
        {
            path: "profile",
            element: <div>Profile Page - Coming Soon</div>
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