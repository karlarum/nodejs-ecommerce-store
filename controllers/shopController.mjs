import products from '../data/products.mjs';

// Calculate cart totals
function calculateCartTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shipping: shipping.toFixed(2),
    total: total.toFixed(2)
  };
}

// Find cart item index
function findCartItemIndex(cart, productId) {
  return cart.findIndex(item => item.id === productId);
}

export function getHome(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / limit);
  
  res.render('index', { 
    products: paginatedProducts,
    currentPage: page,
    totalPages,
    hasNextPage: endIndex < products.length,
    hasPrevPage: page > 1,
    cartCount: req.session.cart.length
  });
}

export function getProduct(req, res) {
  const productId = req.params.id;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).render('error', { 
      error: 'Product Not Found',
      message: 'The product you are looking for does not exist.'
    });
  }
  
  // Get related products
  const relatedProducts = products
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, 4);
  
  res.render('product', { 
    product,
    relatedProducts,
    cartCount: req.session.cart.length
  });
}

export function addToCart(req, res) {
  const productId = req.body.productId;
  const quantity = parseInt(req.body.quantity) || 1;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existingItemIndex = findCartItemIndex(req.session.cart, productId);
  
  if (existingItemIndex > -1) {
    // Update quantity if item exists
    req.session.cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    req.session.cart.push({
      ...product,
      quantity: quantity
    });
  }

  // Return JSON for AJAX requests, redirect for form submissions
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json({ 
      success: true, 
      cartCount: req.session.cart.length,
      message: `${product.name} added to cart!`
    });
  } else {
    res.redirect('/cart');
  }
}

export function removeFromCart(req, res) {
  const productId = req.body.productId;
  const itemIndex = findCartItemIndex(req.session.cart, productId);
  
  if (itemIndex > -1) {
    req.session.cart.splice(itemIndex, 1);
  }
  
  res.redirect('/cart');
}

export function updateCartQuantity(req, res) {
  const productId = req.body.productId;
  const newQuantity = parseInt(req.body.quantity);
  const itemIndex = findCartItemIndex(req.session.cart, productId);
  
  if (itemIndex > -1 && newQuantity > 0) {
    req.session.cart[itemIndex].quantity = newQuantity;
  }
  
  res.redirect('/cart');
}

export function getCart(req, res) {
  const cart = req.session.cart || [];
  const totals = calculateCartTotals(cart);
  
  res.render('cart', { 
    cart,
    ...totals,
    cartCount: cart.length
  });
}

export function getCheckout(req, res) {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  
  const totals = calculateCartTotals(cart);
  
  res.render('checkout', { 
    cart,
    ...totals,
    user: req.session.user,
    cartCount: cart.length
  });
}

export function processOrder(req, res) {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  
  // Process payment
  const orderData = {
    items: cart,
    ...calculateCartTotals(cart),
    customerInfo: req.body,
    orderDate: new Date().toISOString(),
    orderId: 'ORD-' + Date.now()
  };
  
  // Store order in session
  if (!req.session.orders) {
    req.session.orders = [];
  }
  req.session.orders.push(orderData);
  
  // Clear cart
  req.session.cart = [];
  
  res.render('order-confirmation', { 
    order: orderData,
    cartCount: 0
  });
}