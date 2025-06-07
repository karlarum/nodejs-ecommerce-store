import express from 'express';
import {
  getHome,
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  getCheckout,
  processOrder,
  getProduct
} from '../controllers/shopController.mjs';

const router = express.Router();

// Home and product routes
router.get('/', getHome);
router.get('/product/:id', getProduct);

// Cart management routes
router.post('/add-to-cart', addToCart);
router.get('/cart', getCart);
router.post('/remove-from-cart', removeFromCart);
router.post('/update-cart', updateCartQuantity);

// Checkout and order routes
router.get('/checkout', getCheckout);
router.post('/process-order', processOrder);

export default router;