const request = require('supertest');
const app = require('../server');
const { testUser, cleanupDatabase } = require('./setup');

// Clear database before and after tests
beforeAll(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await cleanupDatabase();
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password,
          role: testUser.role
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
      expect(res.body.data.user).toHaveProperty('name', testUser.name);
      expect(res.body.data.user).toHaveProperty('role', testUser.role);
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should return error if user already exists', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });

    it('should return error if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Incomplete User'
        });
      
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should return error if credentials are invalid', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.status).toEqual('fail');
    });

    it('should return error if user does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });
}); 