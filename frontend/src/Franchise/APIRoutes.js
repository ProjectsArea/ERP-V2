const api = process.env.REACT_APP_API;

export const host = `${api}`;

// ------------- franchise admin routes ----------------------
export const uploadItemsRoute = `${host}/franchise/admin/uploadItems`
export const getAllItemsRoute = `${host}/franchise/admin/allItems`
export const getAdminOrdersRoute = `${host}/franchise/admin/allOrders`
export const updateOrderStatusRoute = `${host}/franchise/admin/updateOrderStatus`


// ------------- franchise user routes ------------------------
export const getAllProductsRoute = `${host}/franchise/user/getAllProducts`
export  const buyNowRoute = `${host}/franchise/user/buyNow`;
export const buyAllRoute = `${host}/franchise/user/buyAll`;
export const orderHistoryRoute =  `${host}/franchise/user/getHistory`


// ------------- franchise user routes ------------------------
export const getAllOrdersRoute = `${host}/franchise/accounts/getAllOrders`;
export const updatePaymentStatusRoute = `${host}/franchise/accounts/updatePaymentStatus`
export const getVerificationsRoute = `${host}/franchise/accounts/getVerifications`
export const getRejectionsRoute = `${host}/franchise/accounts/getRejections`




// ------------- franchise store routes ------------------------
export const getStoreDataRoute = `${host}/franchise/store/getStoreData`
export const updateStoreDataRoute = `${host}/franchise/store/updateStoreData`