const request = require('supertest');
const app = require('../server');
const { setupTestUser, setupTestPost, testPost, cleanupDatabase } = require('./setup');

let token;
let user;
let post;

// Setup test data before running tests
beforeAll(async () => {
  await cleanupDatabase();
  const testData = await setupTestUser();
  user = testData.user;
  token = testData.token;
});

// Clean up after tests
afterAll(async () => {
  await cleanupDatabase();
});

describe('Post Endpoints', () => {
  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: testPost.title,
          content: testPost.content,
          tags: testPost.tags
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.post).toHaveProperty('id');
      expect(res.body.data.post).toHaveProperty('title', testPost.title);
      expect(res.body.data.post).toHaveProperty('content', testPost.content);
      expect(res.body.data.post).toHaveProperty('published', false);
      expect(res.body.data.post.tags).toHaveLength(testPost.tags.length);
      
      post = res.body.data.post;
    });

    it('should return error if not authenticated', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Unauthorized Post',
          content: 'This should fail'
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/posts', () => {
    it('should return empty list when no posts are published', async () => {
      const res = await request(app).get('/api/posts');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.posts).toBeInstanceOf(Array);
      // No posts are published yet
      expect(res.body.data.posts.filter(p => p.published)).toHaveLength(0);
    });
  });

  describe('GET /api/posts/unpublished', () => {
    it('should return author\'s unpublished posts', async () => {
      const res = await request(app)
        .get('/api/posts/unpublished')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.posts).toBeInstanceOf(Array);
      expect(res.body.data.posts).toHaveLength(1);
      expect(res.body.data.posts[0]).toHaveProperty('id', post.id);
    });

    it('should return error if not authenticated', async () => {
      const res = await request(app).get('/api/posts/unpublished');
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('PATCH /api/posts/:id/publish', () => {
    it('should toggle post published status', async () => {
      const res = await request(app)
        .patch(`/api/posts/${post.id}/publish`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.post).toHaveProperty('published', true);
      
      // Now the post should be publicly visible
      const publicRes = await request(app).get('/api/posts');
      expect(publicRes.body.data.posts).toHaveLength(1);
      expect(publicRes.body.data.posts[0]).toHaveProperty('id', post.id);
    });

    it('should return error if post does not exist', async () => {
      const res = await request(app)
        .patch('/api/posts/nonexistent-id/publish')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a specific published post', async () => {
      const res = await request(app).get(`/api/posts/${post.id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.post).toHaveProperty('id', post.id);
      expect(res.body.data.post).toHaveProperty('title', testPost.title);
    });

    it('should return error if post does not exist', async () => {
      const res = await request(app).get('/api/posts/nonexistent-id');
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update post title and content', async () => {
      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      
      const res = await request(app)
        .put(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.post).toHaveProperty('title', updatedData.title);
      expect(res.body.data.post).toHaveProperty('content', updatedData.content);
    });

    it('should return error if not the author', async () => {
      // Create another user
      const anotherUser = await setupTestUser();
      anotherUser.user.email = 'another@example.com';
      
      const res = await request(app)
        .put(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${anotherUser.token}`)
        .send({ title: 'Unauthorized update' });
      
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(204);
      
      // Verify post is deleted
      const getRes = await request(app).get(`/api/posts/${post.id}`);
      expect(getRes.statusCode).toEqual(404);
    });
  });
}); 