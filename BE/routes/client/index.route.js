const categoryMiddleware = require("../../middleware/client/category.middleware");
const cartMiddleware = require("../../middleware/client/cart.middleware");
const userMiddleware = require("../../middleware/client/user.middleware");
const mockAuthMiddleware = require("../../middleware/client/mockAuth.middleware");

const searchRoute = require("./search.route");
const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const orderRoute = require("./order.route");
const categoryRoutes = require("./category.route");
module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId); // lấy ra số lượng sp trong giỏ hàng
    app.use("/", homeRoutes );
    app.use("/category", categoryRoutes);
    app.use("/products", productRoutes);
    app.use("/search", searchRoute);
    app.use("/cart", mockAuthMiddleware.mockUser, cartRoute);
    app.use("/checkout", mockAuthMiddleware.mockUser, checkoutRoute);
    app.use("/auth", authRoute);
    app.use("/order", mockAuthMiddleware.mockUser, orderRoute);
    app.use("/user",userMiddleware.infoUser, userRoute);
}
