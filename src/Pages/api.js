// ─── src/api.js ───────────────────────────────────────────────────────────────
// Central API utility for EthnicBeing

export const API = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

/**
 * Authenticated fetch wrapper.
 * Automatically attaches Bearer token from localStorage.
 * Throws on non-2xx responses with the server's error message.
 */
export const authFetch = async (path, options = {}) => {
  const token = localStorage.getItem("eb_token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:         (body) => authFetch("/auth/login",          { method: "POST", body: JSON.stringify(body) }),
  register:      (body) => authFetch("/auth/register",       { method: "POST", body: JSON.stringify(body) }),
  googleAuth:    (body) => authFetch("/auth/google",         { method: "POST", body: JSON.stringify(body) }),
  me:            ()     => authFetch("/auth/me"),
  logout:        ()     => authFetch("/auth/logout",         { method: "POST" }),
  forgotPw:      (body) => authFetch("/auth/forgot-password",{ method: "POST", body: JSON.stringify(body) }),
  verifyOtp:     (body) => authFetch("/auth/verify-otp",     { method: "POST", body: JSON.stringify(body) }),
  resetPw:       (body) => authFetch("/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const productAPI = {
  list:          (params = {}) => authFetch("/products?" + new URLSearchParams(params)),
  byId:          (id)          => authFetch(`/products/${id}`),
  bySlug:        (slug)        => authFetch(`/products/slug/${slug}`),
  featured:      ()            => authFetch("/products/featured"),
  bestsellers:   ()            => authFetch("/products/bestsellers"),
  newArrivals:   ()            => authFetch("/products/new-arrivals"),
  search:        (q, page = 1) => authFetch(`/products/search?q=${encodeURIComponent(q)}&page=${page}`),
  addReview:     (id, body)    => authFetch(`/products/${id}/reviews`, { method: "POST", body: JSON.stringify(body) }),
  getReviews:    (id)          => authFetch(`/products/${id}/reviews`),
};

// ─── CART ─────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:           ()            => authFetch("/cart"),
  add:           (body)        => authFetch("/cart/add",             { method: "POST", body: JSON.stringify(body) }),
  update:        (itemId, qty) => authFetch(`/cart/update/${itemId}`, { method: "PUT",  body: JSON.stringify({ qty }) }),
  remove:        (itemId)      => authFetch(`/cart/remove/${itemId}`, { method: "DELETE" }),
  clear:         ()            => authFetch("/cart/clear",           { method: "DELETE" }),
  merge:         (items)       => authFetch("/cart/merge",           { method: "POST", body: JSON.stringify({ items }) }),
  validate:      ()            => authFetch("/cart/validate",        { method: "POST" }),
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  place:         (body)        => authFetch("/orders",               { method: "POST", body: JSON.stringify(body) }),
  myOrders:      ()            => authFetch("/orders"),
  byId:          (id)          => authFetch(`/orders/${id}`),
  track:         (id)          => authFetch(`/orders/${id}/track`),
  cancel:        (id, reason)  => authFetch(`/orders/${id}/cancel`,  { method: "POST", body: JSON.stringify({ reason }) }),
  return:        (id, reason)  => authFetch(`/orders/${id}/return`,  { method: "POST", body: JSON.stringify({ reason }) }),
};

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder:   (orderId)     => authFetch("/payments/create-order", { method: "POST", body: JSON.stringify({ orderId }) }),
  verify:        (body)        => authFetch("/payments/verify",        { method: "POST", body: JSON.stringify(body) }),
  details:       (orderId)     => authFetch(`/payments/${orderId}`),
};

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
export const wishlistAPI = {
  get:           ()            => authFetch("/wishlist"),
  add:           (productId)   => authFetch(`/wishlist/${productId}`, { method: "POST" }),
  remove:        (productId)   => authFetch(`/wishlist/${productId}`, { method: "DELETE" }),
  clear:         ()            => authFetch("/wishlist",              { method: "DELETE" }),
  check:         (productId)   => authFetch(`/wishlist/check/${productId}`),
};

// ─── COUPONS ──────────────────────────────────────────────────────────────────
export const couponAPI = {
  validate:      (code, orderTotal) =>
    authFetch("/coupons/validate", { method: "POST", body: JSON.stringify({ code, orderTotal }) }),
};

// ─── MISC ─────────────────────────────────────────────────────────────────────
export const miscAPI = {
  categories:    ()            => authFetch("/categories"),
  contact:       (body)        => authFetch("/contact",              { method: "POST", body: JSON.stringify(body) }),
  newsletter:    (email)       => authFetch("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
};