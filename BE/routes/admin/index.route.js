const dashBoardRoute = require("./dashBoard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./product-category.route");
const RoleRoute = require("./role.route");
const AccountRoute = require("./account.route");
const authRoute = require("./auth.route");
const myAccountRoute = require("./myaccount.route");
const settingRoute = require("./setting.route");
const authMiddleware = require("../../middleware/admin/auth.middleware");
const envenuRoute = require("./revenue.route");
const orderRoute = require("./order.route");
const systemConfig = require("../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use( PATH_ADMIN + '/dashBoard', dashBoardRoute );

    app.use( PATH_ADMIN + '/products',authMiddleware.requireAuth, productRoute );

    app.use( PATH_ADMIN + '/product-category',authMiddleware.requireAuth, productCategoryRoute);

    app.use( PATH_ADMIN + '/role',authMiddleware.requireAuth, RoleRoute);

    app.use(PATH_ADMIN + '/accounts',authMiddleware.requireAuth, AccountRoute);
    app.use(PATH_ADMIN + '/auth', authRoute);

    app.use(PATH_ADMIN + '/myaccount', myAccountRoute);

    app.use(PATH_ADMIN + '/revenue',authMiddleware.requireAuth, envenuRoute);

    app.use(PATH_ADMIN + '/order',authMiddleware.requireAuth, orderRoute);

    app.use(PATH_ADMIN + '/setting',authMiddleware.requireAuth, settingRoute);
}
