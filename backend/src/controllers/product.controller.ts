import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Product } from '../models/Product.model';
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
  PriceCalculationResult,
} from '../../../shared/types/product.types';

// GET /api/products
export const getProducts = async (
  req: Request<Record<string, never>, unknown, unknown, ProductFilters>,
  res: Response
): Promise<void> => {
  try {
    const { category, search, minPrice, maxPrice, seller, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (seller) filter.seller = seller;
    if (search) filter.$text = { $search: search };
    if (minPrice || maxPrice) {
      filter.basePrice = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('seller', 'name company isVerified')
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: msg });
  }
};

// GET /api/products/:id
export const getProduct = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name company isVerified phone address');

    if (!product || !product.isActive) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ product });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: msg });
  }
};

// POST /api/products — Seller only
export const createProduct = async (
  req: Request<Record<string, never>, unknown, CreateProductDTO>,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const product = await Product.create({ ...req.body, seller: req.user?._id });
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: msg });
  }
};

// PUT /api/products/:id
export const updateProduct = async (
  req: Request<{ id: string }, unknown, UpdateProductDTO>,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const isOwner = product.seller.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: 'Not authorized to update this product' });
      return;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ message: 'Product updated', product: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: msg });
  }
};

// DELETE /api/products/:id — soft delete
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const isOwner = product.seller.toString() === req.user?._id.toString();
    if (!isOwner && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    product.isActive = false;
    await product.save();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: msg });
  }
};

// GET /api/products/:id/price?qty=500
export const getPriceForQty = async (
  req: Request<{ id: string }, PriceCalculationResult, unknown, { qty?: string }>,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' } as never);
      return;
    }

    const qty = Number(req.query.qty) || product.minOrderQty;
    const pricePerUnit = product.getPriceForQty(qty);
    const subtotal = pricePerUnit * qty;
    const gstAmount = (subtotal * product.gstRate) / 100;

    res.json({ pricePerUnit, quantity: qty, subtotal, gstAmount, totalAmount: subtotal + gstAmount });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: msg } as never);
  }
};