import express from 'express';
import multer from 'multer';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// Configure multer for in-memory storage (BSON Binary)
const upload = multer({ storage: multer.memoryStorage() });

// Create product with images
router.post('/create', upload.array('images', 5), productController.createProduct);

// Get all products
router.get('/all', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Update product
router.put('/update/:id', upload.array('images', 5), productController.updateProduct);

// Delete product
router.delete('/delete/:id', productController.deleteProduct);

// Get product image
router.get('/image/:productId/:imageIndex', productController.getProductImage);

export default router;
