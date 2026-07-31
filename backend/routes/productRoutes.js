import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// Create product with base64 image payload
router.post('/addproduct', productController.addProduct);

// Get all products
router.get('/all', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Update product
router.put('/update/:id', productController.updateProduct);

// Delete product
router.delete('/delete/:id', productController.deleteProduct);

// Get product image
router.get('/image/:productId/:imageIndex', productController.getProductImage);

export default router;
