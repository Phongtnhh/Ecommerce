import React from 'react';
import AdminLayout from '../admin/layouts/AdminLayout';
import Dashboard from '../admin/pages/Dashboard';
import ProductsManagement from '../admin/pages/ProductsManagement';

const adminRoutes = {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        {
            index: true,
            element: <Dashboard />
        },
        {
            path: "products",
            element: <ProductsManagement />
        },
        {
            path: "products/create",
            element: <div>Create Product Page - Coming Soon</div>
        },
        {
            path: "products/:id/edit",
            element: <div>Edit Product Page - Coming Soon</div>
        },
        {
            path: "categories",
            element: <div>Categories Management - Coming Soon</div>
        },
        {
            path: "orders",
            element: <div>Orders Management - Coming Soon</div>
        },
        {
            path: "orders/pending",
            element: <div>Pending Orders - Coming Soon</div>
        },
        {
            path: "orders/delivered",
            element: <div>Delivered Orders - Coming Soon</div>
        },
        {
            path: "customers",
            element: <div>Customers Management - Coming Soon</div>
        },
        {
            path: "customers/vip",
            element: <div>VIP Customers - Coming Soon</div>
        },
        {
            path: "reports/revenue",
            element: <div>Revenue Reports - Coming Soon</div>
        },
        {
            path: "reports/bestsellers",
            element: <div>Best Sellers Report - Coming Soon</div>
        },
        {
            path: "reports/customers",
            element: <div>Customer Statistics - Coming Soon</div>
        },
        {
            path: "settings/general",
            element: <div>General Settings - Coming Soon</div>
        },
        {
            path: "settings/payment",
            element: <div>Payment Settings - Coming Soon</div>
        },
        {
            path: "settings/shipping",
            element: <div>Shipping Settings - Coming Soon</div>
        },
        {
            path: "profile",
            element: <div>Admin Profile - Coming Soon</div>
        }
    ]
}

export default adminRoutes;