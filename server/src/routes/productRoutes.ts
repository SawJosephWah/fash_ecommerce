import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getFilterMetadata, getNewArrivals, getProductById, updateProduct } from '../controllers/productController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validatorMiddleware';
import { productCreateRules, productUpdateRules } from '../validators/productValidator';
import { upload } from '../utils/multerConfig';

const router = express.Router();

// Only authenticated users can create products
router.post('/',
    protect,
    restrictTo('admin'),
    upload.array('images', 5), // 'images' is the key, 5 is the limit
    productCreateRules,
    validate,
    createProduct
);
router.put('/:id',
    protect,
    restrictTo('admin'),
    upload.array('images', 5), // 'images' is the key, 5 is the limit
    productUpdateRules,
    validate, updateProduct);
// routes.ts
// router.patch('/:id', authMiddleware, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

router.get('/', getAllProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/featured', getFeaturedProducts);
router.get('/filters', getFilterMetadata);
router.get('/:id', getProductById);

export default router;