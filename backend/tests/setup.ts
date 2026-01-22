// tests/setup.ts
// Runs before all tests — sets up environment variables for test suite

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_rawmart_2024';
process.env.JWT_EXPIRES_IN = '1d';