import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app';
import { User } from '../../src/models/User.model';

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
  await User.deleteMany({});
});

const buyerPayload = {
  name: 'Priya Sharma',
  email: 'priya@factories.in',
  password: 'securepass123',
  role: 'buyer',
  company: 'Priya Industries',
};

describe('Auth API — Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('registers buyer and returns token + user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(buyerPayload);

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(buyerPayload.email);
      expect(res.body.user.role).toBe('buyer');
      // Password must never appear in response
      expect(res.body.user.password).toBeUndefined();
    });

    it('registers seller successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...buyerPayload, email: 'seller@metals.in', role: 'seller' });

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('seller');
    });

    it('rejects duplicate email with 400', async () => {
      await request(app).post('/api/auth/register').send(buyerPayload);
      const res = await request(app).post('/api/auth/register').send(buyerPayload);

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/already registered/i);
    });

    it('rejects short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...buyerPayload, password: '123' });
      expect(res.status).toBe(400);
    });

    it('rejects invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...buyerPayload, email: 'not-an-email' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(buyerPayload);
    });

    it('logs in with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: buyerPayload.email, password: buyerPayload.password });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(buyerPayload.email);
    });

    it('rejects wrong password with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: buyerPayload.email, password: 'wrongpassword' });
      expect(res.status).toBe(401);
    });

    it('rejects non-existent user with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ghost@test.com', password: 'anything' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app).post('/api/auth/register').send(buyerPayload);
      token = res.body.token as string;
    });

    it('returns user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(buyerPayload.email);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('returns 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.status).toBe(401);
    });
  });
});