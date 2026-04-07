import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, getPriceForQty,
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category')
    .isIn(['metals','chemicals','polymers','textiles','agricultural','construction','electronics','other'])
    .withMessage('Invalid category'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('unit').isIn(['kg','ton','litre','piece','meter','sqft','bag']).withMessage('Invalid unit'),
  body('minOrderQty').isInt({ min: 1 }).withMessage('Minimum order quantity must be at least 1'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be 0 or greater'),
];

router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/price', getPriceForQty);
router.post('/', protect, authorize('seller', 'admin'), productValidation, createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;