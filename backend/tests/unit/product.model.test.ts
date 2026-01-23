import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Product, IProduct } from '../../src/models/Product.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany({});
});

const validProduct = {
  name: 'TMT Steel Bars',
  description: 'Fe500D grade TMT bars for RCC construction',
  category: 'metals' as const,
  seller: new mongoose.Types.ObjectId(),
  basePrice: 62,
  unit: 'kg' as const,
  minOrderQty: 500,
  stock: 20000,
  gstRate: 18,
};

describe('Product Model — Unit Tests', () => {
  test('creates product with valid data', async () => {
    const product = await Product.create(validProduct);
    expect(product._id).toBeDefined();
    expect(product.name).toBe('TMT Steel Bars');
    expect(product.isActive).toBe(true);
    expect(product.leadTime).toBe(7); // default
  });

  test('rejects missing required fields', async () => {
    const product = new Product({ name: 'Incomplete' });
    await expect(product.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('rejects invalid category', async () => {
    const product = new Product({ ...validProduct, category: 'weapons' as never });
    await expect(product.save()).rejects.toThrow();
  });

  test('rejects negative stock', async () => {
    const product = new Product({ ...validProduct, stock: -100 });
    await expect(product.save()).rejects.toThrow();
  });

  test('rejects negative price', async () => {
    const product = new Product({ ...validProduct, basePrice: -5 });
    await expect(product.save()).rejects.toThrow();
  });

  describe('getPriceForQty()', () => {
    test('returns basePrice when no tiers defined', async () => {
      const product = await Product.create(validProduct);
      expect(product.getPriceForQty(500)).toBe(62);
      expect(product.getPriceForQty(10000)).toBe(62);
    });

    test('returns correct tier price for each range', async () => {
      const product = await Product.create({
        ...validProduct,
        priceTiers: [
          { minQty: 500,  maxQty: 999,  pricePerUnit: 62 },
          { minQty: 1000, maxQty: 4999, pricePerUnit: 58 },
          { minQty: 5000,               pricePerUnit: 52 },
        ],
      });

      // Tier 1: 500–999
      expect(product.getPriceForQty(500)).toBe(62);
      expect(product.getPriceForQty(750)).toBe(62);

      // Tier 2: 1000–4999
      expect(product.getPriceForQty(1000)).toBe(58);
      expect(product.getPriceForQty(3000)).toBe(58);

      // Tier 3: 5000+
      expect(product.getPriceForQty(5000)).toBe(52);
      expect(product.getPriceForQty(20000)).toBe(52);
    });

    test('returns basePrice when qty is below all tiers', async () => {
      const product = await Product.create({
        ...validProduct,
        basePrice: 70,
        priceTiers: [{ minQty: 1000, pricePerUnit: 55 }],
      });
      expect(product.getPriceForQty(100)).toBe(70);
    });
  });

  test('creates text index for search', async () => {
    await Product.create(validProduct);
    const indexes = await Product.collection.indexes();
    const textIndex = indexes.find(i => i.key._fts === 'text');
    expect(textIndex).toBeDefined();
  });
});